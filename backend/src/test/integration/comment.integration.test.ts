
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const { getUser } = vi.hoisted(() => ({
  getUser: vi.fn(),
}))

vi.mock('../../config/supabase.js', () => ({
  supabase: {
    auth: {
      getUser,
    },
  },
}))

import app from '../../app.js'
import { prisma } from '../../config/prisma.js'

type FixtureUser = {
  id: string
  email: string
}

type Fixture = {
  owner: FixtureUser
  member: FixtureUser
  outsider: FixtureUser
  workspaceId: string
  projectId: string
  taskId: string
}

let fixture: Fixture
const createdWorkspaceIds: string[] = []

function authAs(user: FixtureUser) {
  getUser.mockResolvedValue({
    data: {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {},
      },
    },
    error: null,
  })
}

async function createFixtureUser(role: string): Promise<FixtureUser> {
  const user = {
    id: `comment-${role.toLowerCase()}-${randomUUID()}`,
    email: `comment-${role.toLowerCase()}-${randomUUID()}@example.test`,
  }

  await prisma.user.create({ data: user })
  return user
}

beforeAll(async () => {
  const [owner, member, outsider] = await Promise.all([
    createFixtureUser('owner'),
    createFixtureUser('member'),
    createFixtureUser('outsider'),
  ])

  const workspace = await prisma.workspace.create({
    data: {
      name: `Comment Workspace ${randomUUID()}`,
      slug: `comment-workspace-${randomUUID()}`,
      members: {
        create: [
          { userId: owner.id, role: 'OWNER' },
          { userId: member.id, role: 'MEMBER' },
        ],
      },
    },
  })

  createdWorkspaceIds.push(workspace.id)

  const project = await prisma.project.create({
    data: {
      name: 'Comment Integration Project',
      slug: `comment-project-${randomUUID()}`,
      workspaceId: workspace.id,
    },
  })

  const task = await prisma.task.create({
    data: {
      title: 'Comment Integration Task',
      projectId: project.id,
    },
  })

  fixture = {
    owner,
    member,
    outsider,
    workspaceId: workspace.id,
    projectId: project.id,
    taskId: task.id,
  }
})

beforeEach(() => {
  getUser.mockReset()
})

afterAll(async () => {
  await prisma.workspace.deleteMany({
    where: { id: { in: createdWorkspaceIds } },
  })

  await prisma.user.deleteMany({
    where: {
      id: {
        in: [
          fixture.owner.id,
          fixture.member.id,
          fixture.outsider.id,
        ],
      },
    },
  })

  await prisma.$disconnect()
})

describe('Task comments API', () => {
  it('allows a workspace member to create and list comments', async () => {
    authAs(fixture.member)

    const createResponse = await request(app)
      .post(`/api/v1/tasks/${fixture.taskId}/comments`)
      .set('Authorization', 'Bearer member-token')
      .send({ content: 'This is an integration test comment' })
      .expect(201)

    expect(createResponse.body.comment.content).toBe(
      'This is an integration test comment',
    )
    expect(createResponse.body.comment.authorId).toBe(fixture.member.id)

    const listResponse = await request(app)
      .get(`/api/v1/tasks/${fixture.taskId}/comments`)
      .set('Authorization', 'Bearer member-token')
      .expect(200)

    expect(listResponse.body.comments).toHaveLength(1)
    expect(listResponse.body.comments[0].id).toBe(
      createResponse.body.comment.id,
    )
  })

  it('rejects empty and oversized comments', async () => {
    authAs(fixture.member)

    await request(app)
      .post(`/api/v1/tasks/${fixture.taskId}/comments`)
      .set('Authorization', 'Bearer member-token')
      .send({ content: '   ' })
      .expect(400)

    await request(app)
      .post(`/api/v1/tasks/${fixture.taskId}/comments`)
      .set('Authorization', 'Bearer member-token')
      .send({ content: 'a'.repeat(5001) })
      .expect(400)
  })

  it('trims comment content before saving', async () => {
    authAs(fixture.member)

    const response = await request(app)
      .post(`/api/v1/tasks/${fixture.taskId}/comments`)
      .set('Authorization', 'Bearer member-token')
      .send({ content: '   Trimmed comment   ' })
      .expect(201)

    expect(response.body.comment.content).toBe('Trimmed comment')
  })

  it('allows the author to update their own comment', async () => {
    authAs(fixture.member)

    const created = await prisma.comment.create({
      data: {
        content: 'Original comment',
        taskId: fixture.taskId,
        authorId: fixture.member.id,
      },
    })

    const response = await request(app)
      .patch(`/api/v1/comments/${created.id}`)
      .set('Authorization', 'Bearer member-token')
      .send({ content: 'Updated comment' })
      .expect(200)

    expect(response.body.comment.content).toBe('Updated comment')
    expect(response.body.comment.authorId).toBe(fixture.member.id)
  })

  it('prevents another workspace member from updating a comment', async () => {
    const created = await prisma.comment.create({
      data: {
        content: 'Owner comment',
        taskId: fixture.taskId,
        authorId: fixture.owner.id,
      },
    })

    authAs(fixture.member)

    await request(app)
      .patch(`/api/v1/comments/${created.id}`)
      .set('Authorization', 'Bearer member-token')
      .send({ content: 'Unauthorized update' })
      .expect(404)

    const unchanged = await prisma.comment.findUnique({
      where: { id: created.id },
    })

    expect(unchanged?.content).toBe('Owner comment')
  })

  it('allows the author to delete their own comment', async () => {
    const created = await prisma.comment.create({
      data: {
        content: 'Comment to delete',
        taskId: fixture.taskId,
        authorId: fixture.member.id,
      },
    })

    authAs(fixture.member)

    await request(app)
      .delete(`/api/v1/comments/${created.id}`)
      .set('Authorization', 'Bearer member-token')
      .expect(200)

    const deleted = await prisma.comment.findUnique({
      where: { id: created.id },
    })

    expect(deleted).toBeNull()
  })

  it('prevents another member from deleting a comment', async () => {
    const created = await prisma.comment.create({
      data: {
        content: 'Protected comment',
        taskId: fixture.taskId,
        authorId: fixture.owner.id,
      },
    })

    authAs(fixture.member)

    await request(app)
      .delete(`/api/v1/comments/${created.id}`)
      .set('Authorization', 'Bearer member-token')
      .expect(404)

    const unchanged = await prisma.comment.findUnique({
      where: { id: created.id },
    })

    expect(unchanged).not.toBeNull()
  })

  it('rejects users outside the task workspace', async () => {
    authAs(fixture.outsider)

    await request(app)
      .get(`/api/v1/tasks/${fixture.taskId}/comments`)
      .set('Authorization', 'Bearer outsider-token')
      .expect(403)

    await request(app)
      .post(`/api/v1/tasks/${fixture.taskId}/comments`)
      .set('Authorization', 'Bearer outsider-token')
      .send({ content: 'Unauthorized comment' })
      .expect(403)
  })

  it('does not accept a client-supplied author ID', async () => {
    authAs(fixture.member)

    const response = await request(app)
      .post(`/api/v1/tasks/${fixture.taskId}/comments`)
      .set('Authorization', 'Bearer member-token')
      .send({
        content: 'Identity verification',
        authorId: fixture.owner.id,
      })
      .expect(201)

    expect(response.body.comment.authorId).toBe(fixture.member.id)
  })
})

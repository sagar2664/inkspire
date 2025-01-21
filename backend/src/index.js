import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'jsonwebtoken';
const app = new Hono();
// <{
//   Bindings: {
//     DATABASE_URL: string
//   }
// }>
app.get('/', (c) => {
    return c.text('Hello Hono!');
});
app.post('/api/v1/signup', async (c) => {
    const prisma = new PrismaClient({
        //@ts-ignore
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const user = await prisma.user.create({
        data: {
            email: body.email,
            password: body.password,
        }
    });
    const token = await sign({ id: user.id }, "secret");
    return c.json({
        jwt: token
    });
});
export default app;

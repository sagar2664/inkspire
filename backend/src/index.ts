import { Hono } from 'hono'
import {PrismaClient} from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'

const app = new Hono()

// <{
//   Bindings: {
//     DATABASE_URL: string
//   }
// }>

app.use('/api/v1/blog/*',async (c) => {
  const header = c.req.header('authorization') || "";

  const token= header.split(" ")[1];
  //@ts-ignore
  const response = await verify(token,c.env.JWT_SECRET);

  if(response.id){
    //@ts-ignore
    next();
  }else{
    return c.json({
      error: "Unauthorized"
    });
  }
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/signup', async (c) => { 

  const prisma = new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json();

  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    }
  });

  
  const token = await sign({id: user.id},"secret");

  return c.json({
    jwt: token
  });

});

app.post('/api/v1/signin', async (c) => {
  const prisma =new PrismaClient({
    //@ts-ignore
    datasourceUrl: c.env.DATABASE_URL,
  });

  const body = await c.req.json();

  const user = await prisma.user.findUnique({
    where:{
      email: body.email,
      password: body.password
    }
  });

  if(!user){
    return c.json({
      error: "User not found"
    });
  }

  //@ts-ignore
  const token = await sign({id: user}, "secret" );

  return c.json({
    jwt: token
  });

})

export default app

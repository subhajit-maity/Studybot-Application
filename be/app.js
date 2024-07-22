const { PrismaClient } = require('@prisma/client');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors'); 
const port = 3002;
require('dotenv').config();
const prisma = new PrismaClient();
const SECRET_KEY=process.env.SECRET_KEY;

app.use(express.json());
app.use(cors()); 

app.get('/', (req, res) => {
  res.send('Hello World!');
});



const authMiddleware=(async (req,res,next)=>{

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  try{
    if (!token) {
      return res.sendStatus(401);
    }
  
    const decoded= jwt.verify(token,SECRET_KEY);
    req.email=decoded.userId;
    const user=await prisma.user.findUnique({where:{email:req.email}});
    req.username=user.username;
    req.userid=user.id;
    next();

  }catch(e){
    res.status(400).send({
      message:"Some Error Occurred"
    })
  }
 
  });

  

//signup routes
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
     // Hash the password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);
    const userExist = await prisma.user.findUnique({ where: { email } });

    if (userExist) {
      return res.status(400).send({
        message: 'User already exists',
      });
    }
    const dbresult= await prisma.$transaction(async(prisma)=>{
      const user = await prisma.user.create({
        data: {
          username:username,
          email:email,
          password: hashedPassword,
        },
      });
    

      const [subject1,subject2]=await Promise.all([
        prisma.subject.create({
          data:{
            name:"science",
            reader:{ connect: { id: user.id } },
            
          }
        }),
        prisma.subject.create({
          data:{
            name:"computer",
            reader:{ connect: { id: user.id } },
          }
        })
      ]);
   res.status(201).send({
    message: 'User created successfully',
    user: { id: user.id, email: user.email },
  });

    }, {
      maxWait: 6000, // default: 2000
      timeout: 8000, // default: 5000
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).send({
      message: 'User not created. Try again later.',
    });
  }
});


//getting user route
app.get('/user',authMiddleware,async (req,res)=>{

  const user= await prisma.user.findMany({
    where:{
      id:req.userid
    },
    include:{
      subjects:{
        where:{
          name:req.body.subjectname
        }
        
      }
      
    }
  })
res.send(
  user
)

})

app.post('/login', async (req, res) => {
    const { email, password } = await req.body;
  
    try {
      // Check if the user exists
      const user = await prisma.user.findUnique({ where: { email } });
  
      if (!user) {
        return res.status(401).send({
          message: 'Invalid email or password',
        });
      }
  
      // Compare the password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).send({
          message: 'Invalid email or password',
        });
      }
  
      // Create a JWT token (optional but recommended)
      const token = jwt.sign({ userId: user.email }, SECRET_KEY, { expiresIn: '3h' });
  
      res.status(200).send({
        message: 'Login successful',
        token,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        message: 'An error occurred. Please try again later.',
      });
    }
  });
  
//   upload chats

// Route for uploading chats
app.post('/upload-chats/:id', async (req, res) => {
  try {
    const { userId, subjectId, chatMessages } = req.body;
    console.log(req.params.id)
    const Checkchat=await prisma.chat.findMany({
      where:{
        id:parseInt(req.params.id, 10)
      }
    });
    
      console.log(Checkchat[0].chat);
    if (Checkchat.length>0) {
      // Chats exist, so update them
      var arr=[...Checkchat[0].chat];
      for(var i=0;i<chatMessages.length;i++){
        arr.push(chatMessages[i]);
      }
      console.log(arr);
     const updatedChats=await prisma.chat.update({
      where:{
        id:parseInt(req.params.id, 10)
      },
      data:{
        chat:[...arr],
      }
     });
      res.status(200).json({ message: 'Chats updated successfully', updatedChats });
    } else {
      // Chats don't exist, so create new ones
      const newChats = await prisma.test.create({
        data:{
          chat: chatMessages,
          userId,
          subject_id: subjectId,
        },
      });
      res.status(201).json({ message: 'New chats created successfully', newChats });
    }
  } catch (error) {
    console.error('Error uploading chats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





app.post('/upload_test/:id', authMiddleware, async (req, res) => {
  console.log("-------------------");
  console.log(req.params.id);
  console.log("-------------------");

  try {
    const testId = parseInt(req.params.id, 10);
    const { qattempted, qcorrect, totalq, qwrong, subjectId } = req.body;

    console.log('User ID:', req.userid);
    console.log('Test ID:', testId);
    console.log('Subject ID:', subjectId);
    console.log('Request Body:', req.body);

    if (!subjectId) {
      return res.status(400).send({ message: 'subjectId is required' });
    }

    const existingTests = await prisma.test.findMany({
      where: {
        id: testId,
        userId: req.userid,
      }
    });

    console.log('Number of existing tests:', existingTests.length);

    if (existingTests.length !== 0) {
      const updatedTest = await prisma.test.update({
        where: {
          id: testId,
        },
        data: {
          qattempted,
          qcorrect,
          totalq,
          qwrong
        }
      });

      return res.send( updatedTest);
    } else {
      console.log('Creating new test...');
      console.log(req.body);
      console.log(req.userid);

      const newlyTest = await prisma.test.create({
        data: {
          testname: 'test',
          user: { connect: { id: req.userid } },
          Testfrom: { connect: { id: subjectId } },
          qattempted,
          qcorrect,
          totalq,
          qwrong
        }
      });

      // console.log('New test created:', newlyTest);
      return res.status(200).send(newlyTest);
    }

  } catch (error) {
    console.error('Error occurred:', error);
    return res.status(500).send({ message: 'Error occurred', error });
  }
});


// app.get('',authMiddleware,async(req,res)=>{
//   console.log(req.params.id);
//   try {
//     const Checktest=await prisma.test.findMany({
//       where:{
//         id:parseInt(req.params.id, 10),
//         userId:req.userid,
//       }
//     });
//     if(Checktest!=null){
//       res.status(200).send(Checktest)  
//     }else{
//       res.status(400).send({
//         message:"This test doesn't exist"
//       })
//     }

//   } catch (error) {
//     res.status(400).send({
//       message:"Some error occured"
//     })
//   }
// })


app.get('/gettest',authMiddleware,async(req,res)=>{
 
  try{
    
    const ans=await prisma.test.findMany({
      where:{
        userId:req.userid
      }
    });
    res.status(200).send(ans);
  }catch(e){
    // res.status(400).send({
    //   message:"Sorry didn't found it"
    // })
    console.log(e.message);
  }
})

app.get('/get_test/:id',authMiddleware,async(req,res)=>{
    console.log(req.params.id);
    try {
      const Checktest=await prisma.test.findUnique({
        where:{
          id:parseInt(req.params.id, 10),
          userId:req.userid,
        }
      });
      if(Checktest!=null){
        res.status(200).send(Checktest)  
      }else{
        res.status(400).send({
          message:"This test doesn't exist"
        })
      }

    } catch (error) {
      res.status(400).send({
        message:"Some error occured"
      })
    }
})

app.get('/get_chats/:id',authMiddleware,async(req,res)=>{

  const _id=  parseInt(req.params.id,10);
    try{
     const chat=await prisma.chat.create({
      data:{
        id:_id,
      }
     })

      res.status(200).send(
        chat
    )

    }catch(e){
      res.send({
        message:"Some error occured"
    })
    }
})


// upadting chats by id

app.post('/:id',authMiddleware,async (req,res)=>{
  console.log(req.params.id);
  console.log(req.body.array);
  try{
    const chat=await prisma.chat.update({
      where:{id:parseInt(req.params.id,10)},
      data:{chat:req.body.array}
    });
    res.status(200).send(chat);

  }catch(e){
    res.status(400).send(e.message);
  }
})



app.get('/chatid/:id/:chaptername', authMiddleware, async (req, res) => {
  // console.log(req.query.subjectname);
  console.log(req.params.id);
  // const subjectid=parseInt(req.params.id,10);
  console.log(req.params.chaptername);
  // console.log(subjectid);
  const subject=await prisma.subject.findMany({
    where:{
      name:req.params.id,
      reader_id:req.userid
    }
  });

  try{
    const chapters= await prisma.chapter.findMany({
      where:{
        name:req.params.chaptername,
        user_Id:req.userid,
        subjectid:subject[0].id
      }
    });
    console.log(chapters);
    console.log('----------------------');
    if(chapters.length==0){
      const newchapter= await prisma.chapter.create({
        data:{
          name:req.params.chaptername,
          user:{ connect: { id: req.userid } },
          subjectrelated:{connect:{id:subject[0].id}}
        }
      });
      const newchat=await prisma.chat.create({
        data:{
          user: { connect: { id: req.userid } },
          subjectfrom:{connect:{id:subject[0].id}},
          chapterfrom:{connect:{id:newchapter.id}}
        }
      });
     
      res.status(200).send(newchat);
    }else{
      const chat=await prisma.chat.findMany({
        where:{
          userId :req.userid,
          subject_id : subject[0].id,
          chapter_id:chapters[0].id
        }     
      });
      res.status(200).send(chat[0]);
    }

  }catch(e){
    res.status(400).send({
      message: e.message
  });
  }
    
});


app.get('/get_questions/:subjectname',authMiddleware,async (req,res)=>{
  console.log(req.params.subjectname);
  try {
    const subjectname = req.params.subjectname;

    // Get the total count of questions for the given subject
    const totalQuestions = await prisma.question.count({
      where: { subjectname },
    });

    // Generate up to 10 random offsets
    const randomOffsets = [];
    const maxQuestions = Math.min(totalQuestions, 10);
    while (randomOffsets.length < maxQuestions) {
      const randomOffset = Math.floor(Math.random() * totalQuestions);
      if (!randomOffsets.includes(randomOffset)) {
        randomOffsets.push(randomOffset);
      }
    }

    // Fetch questions starting from these random offsets
    const questions = await Promise.all(
      randomOffsets.map((offset) =>
        prisma.question.findMany({
          skip: offset,
          take: 1,
          where: { subjectname },
          include: { options: true },
        })
      )
    );

    // Flatten the array of arrays
    const flatQuestions = questions.flat();

    res.send(flatQuestions);
  } catch (e) {
    console.error(e);
    res.status(400).send({
      message: "Didn't get any data",
    });
  }

});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

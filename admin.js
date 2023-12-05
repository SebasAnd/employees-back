const express = require('express');
const router = express.Router();
require('dotenv').config();
const { Pool,Client } = require('pg');
var bodyParser = require('body-parser');
const credentials ={
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
  };

  /*const credentials={
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  };*/

router.use(bodyParser.json());

router.get('/getUsers', async function(req, res) {
    try{
        const pool = new Pool(credentials);
        const result = await pool.query("SELECT * FROM employees");
        await pool.end();
        res.setHeader('Content-Type', 'application/json');
        
        if(result['rows'].length > 0){
          res.send(JSON.stringify(result['rows']));
        }else{
          res.send(JSON.stringify({result  :{
            id: -1,
            name: null,
            email: null,
            is_admin: false,
            nick_name: null,
            password: null
    
          }
            
          }));
          }
        
    
      }catch(err){
        res.send({'error':err});
      }
});

router.post('/updateUser', async function(req, res) {  
  try{
    const pool = new Pool(credentials);//UPDATE public.users    ;
    const result = await pool.query("UPDATE users SET name='"+req.body.name+"', nickname='"+req.body.nickname+"', password='"+req.body.password+"', is_admin='"+req.body.is_admin+"'"+
        "WHERE email = '"+req.body.email+"'")
    await pool.end();
    res.setHeader('Content-Type', 'application/json');
    
      res.send(JSON.stringify(result));
    

  }catch(err){
    res.send({'error':err});
  }
  
});
router.post('/deleteUser', async function(req, res) {  
  try{
    console.log(req.body)
    const pool = new Pool(credentials);//UPDATE public.users    ;
    const result = await pool.query("DELETE FROM users WHERE email='"+req.body.email+"'");
    await pool.end();
    res.setHeader('Content-Type', 'application/json');
    
      res.send(JSON.stringify(result));
    

  }catch(err){
    res.send({'error':err});
  }
  
});

module.exports = router;
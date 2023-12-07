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

async function VerifyNullBoss(){
  try{
    const pool = new Pool(credentials);
    const employees = await pool.query("SELECT * FROM employees");
    const relations = await pool.query("SELECT * FROM relations");

    // Verify null boss in employee
    for(let i = 0; i <employees['rows'].length;i++){
      //validate if the user is a employee
      if(employees['rows'][i]['position'] == 'employee'){
        let isNullBoss = true;
        for(let j = 0; j< relations['rows'].length;j++)
        {
          if(relations['rows'][j]['employeeref'] == employees['rows'][i]['email']){
            isNullBoss = false;// deny that the user does not have an employee
            break;
          }
        }
        //this happens only if the employee does not have an boss 
        if(isNullBoss == true){
          //asing a boss to the employee  
          let bossWithoutEmployees = {};      
          for(let b= 0; b < employees['rows'].length; b++){  
            if(employees['rows'][b]['position'] == 'boss'){
              const isBossAlready = await pool.query("SELECT * from relations where boss='"+employees['rows'][b]['email']+"';");
              if(isBossAlready['rows'].length == 0){
                bossWithoutEmployees = employees['rows'][b];
                break;
              }
            } 
          }
          console.log('bosssssss', bossWithoutEmployees);
          if(bossWithoutEmployees['email']!= undefined)
          {
            const addInrelations = await pool.query("INSERT INTO relations(boss, employeeref)  VALUES ('"+bossWithoutEmployees['email']+"', '"+employees['rows'][i]["email"]+"');");
            const updateVersion = await pool.query("UPDATE employees  SET version="+ (parseInt(employees['rows'][i]["version"], 10) + 1) +"WHERE email='"+employees['rows'][i]["email"]+"';")

            console.log(addInrelations,updateVersion);
          }else{
            const getBossWithLessEmployees = await pool.query("SELECT empl.email, Count('employeeref') AS refnumber FROM relations as rel INNER JOIN  public.employees as empl"+
                                                              " ON rel.boss = empl.email  GROUP BY empl.email  ORDER BY refnumber ASC;");

            bossWithoutEmployees = getBossWithLessEmployees['rows'][0];

            const addInrelations = await pool.query("INSERT INTO relations(boss, employeeref)  VALUES ('"+bossWithoutEmployees['email']+"', '"+employees['rows'][i]["email"]+"');");
            const updateVersion = await pool.query("UPDATE employees  SET version="+ (parseInt(employees['rows'][i]["version"], 10) + 1)+" WHERE email='"+employees['rows'][i]["email"]+"';")

            console.log(addInrelations,updateVersion);

          }            
          }                    
        }   
    }
  }
  catch(err){
      console.log({'error':err});
    
  }
}

router.get('/getUsers', async function(req, res) {
    try{
        const pool = new Pool(credentials);
        const result = await pool.query("SELECT * FROM employees");
        await pool.end();
        res.setHeader('Content-Type', 'application/json');
        //await VerifyNullBoss();
        
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

router.post('/addUser', async function(req, res) {  
  try{
    const pool = new Pool(credentials);
    const content = req.body;
    const result = await pool.query("INSERT INTO employees(email, name, position, version)"+
    "VALUES ('"+req.body.email+"','"+req.body.name+"' , '"+req.body.position+"','"+1+"' )");
    
    if(content['relation'].length != 0){
      for(let i = 0; i< content['relation'].length; i++){
        const addInrelations = await pool.query("INSERT INTO relations(boss, employeeref)  VALUES ('"+content['relation'][i]+"', '"+content['email']+"');");
        console.log(addInrelations);
      }
    }else{
      if(content['position'] == 'employee'){        
      VerifyNullBoss();
      }
    }
    await pool.end();
    res.setHeader('Content-Type', 'application/json');
    
    
      res.send(JSON.stringify(result));
    

  }catch(err){
    res.send({'error':err});
  }
  
});

router.post('/updateUser', async function(req, res) {  
  try{
    const pool = new Pool(credentials);//UPDATE public.users    ;
    const result = await pool.query("UPDATE users SET name='"+req.body.name+"', position='"+req.body.nickname+"'"+
        "WHERE email = '"+req.body.email+"'")

    const usersRelations = await pool.query("SELECT * FROM relations WHERE boss = '"+req.body.email+"' OR employeeref = '"+req.body.email+"'")

    const myBossArray = req.body['relation']["boss"];
    const myEmployeeArray = req.body['relation']["employee"];
    
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
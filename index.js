const express=require("express")
app=express()
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser")

app.use(express.json())

app.use(express.urlencoded({extended:true}))

var url=bodyParser.urlencoded({
    extended:false
  });

  app.set('view engine','ejs')

const db=new sqlite3.Database('./election.db',err=>{
    if(err){
      console.log(err)
    }
    console.log("db connected")
})

const create_voter=`create table if not exists voter(
  voter_id int PRIMARY KEY AUTOINCREMENT NOT NULL,
  voter_name varchar(50),
  address varchar(500),
  email varchar(50),
  phone numeric(15),
  age int,
  );`

const create_party=`create table if not exists party(
    party_id varchar(20),
    party_name varchar(50),
    primary key(party_id)
);`

const create_center=`create table if not exists voting_center(
    voting_center_id int,
    voting_ceter_name varchar(50),
    location varchar(50),
    primary key(voting_center_id)
);`

const create_candidate=`create table if not exists candidate(
    candidate_id int,
    candidate_name varchar(50),
    party_id varchar(20),
    can_address varchar(50),
    email varchar(50),
    phone numeric(15),
    primary key(candidate_id),
    foreign key(party_id) references party(party_id) on delete cascade
);`

const create_vote=`create table if not exists vote(
    voter_id int,
    candidate_id int,
    voting_center_id int,
    primary key(voter_id),
    foreign key(voter_id)references voter(voter_id) on delete cascade,
    foreign key(candidate_id)references candidate(cadidate_id) on delete cascade,
    foreign key(voting_center_id)references candidate(voting_center_id) on delete cascade
);`

//db.run for creation and insertion
//table creation
db.run(create_voter,()=>{
    console.log('voter table created')      //id is auto increment
})
db.run(create_party,()=>{
    console.log('party table created')
})
db.run(create_center,()=>{
    console.log('center table created')
})
db.run(create_candidate,()=>{
    console.log('candidate table created')
})

db.run(create_vote,(err)=>{
    if(err){
        console.log(err)
    }
    else
    console.log("vote table created")
})

var id=0

//db.run(`insert into voter(voter_id,voter_name,address,email,phone,age) values(${id+=1},'ashwin','mangalore','@mail.com','9898765',20);`)
//db.run(`delete from voter`)
//db.run(`delete from vote`)

/*db.all(`select * from voter`,(err,rows)=>{
    console.log(rows)
})*/
var can_id=69
//db.run(`insert into candidate values(70,'ash','#278f','mlore','ash@mail.com',6969706);`)
db.all(`select * from candidate`,(err,rows)=>{
    if(err){
        console.log(err)
    }
    else
    console.log(rows)
})
app.post('/',url,(req,res)=>{
    //console.log(req.body)
    db.run(`insert into voter(voter_id,voter_name,address,email,phone,age) values(${req.body.id},'${req.body.name}','${req.body.add}','${req.body.email}',${req.body.phno},${req.body.age})`,(err)=>{
        if(err){
            console.log(err)
        }
    })
     res.render("vote")
     console.log(req.body)
     var id= req.body.id
    voted(id)
    console.log(id)
     /*db.all(`select * from vote`,(err,rows)=>{
         console.log(rows)
     })*/
})

function voted(id){ app.post('/voted',url,(req,res)=>{
   //console.log(req.body.value)

   db.run(`insert into vote(voter_id,candidate_id,voting_center_id) values(${id},(select candidate_id from candidate where candidate_id=${req.body.value}),10)`)
    db.all(`select * from vote`,(err,rows)=>{
        console.log(rows)
    })
    res.render("voted")
})}

app.get('/',(req,res)=>{
    res.render('index')
})
app.listen('3000')
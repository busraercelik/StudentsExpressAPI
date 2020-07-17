const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/studentsDB", {useNewUrlParser: true, useUnifiedTopology: true});

var studentSchema = new mongoose.Schema({
    rollno: {
        type: Number,
        required : true
    },
    name: String,
    address: String
});

var Student = mongoose.model("Student", studentSchema);

//////////////////////////////// Request Targeting All Students //////////////////////////////////////
app.route("/students")
.get(function (req, res) {  
    // kayitli ogrencileri gorelim.
    Student.find(function(err, foundStudents){
        if(!err){
            res.send(foundStudents);
        }else{
            res.send(err);
        }
    })
})
.post(function(req, res){
    // mongodb'ye yeni bir ogrenci kaydedelim.
    const newStudent = new Student({
        name: req.body.name,
        address : req.body.address,
        rollno: req.body.rollno
    });
    newStudent.save(function(err){
       if(!err){
           res.send("Successfully added a new student.");
       }else{
           res.send(err);
       }
    });
})
.delete(function(req, res){
    Student.deleteMany(function (err) {  
        if(!err){
            res.send("Successfully deleted all students.");
        }else{
            res.send(err);
        }
    });
});

//////////////////////////////// Request Targeting Specific Students //////////////////////////////////////

//client'in istedigi particular resource studentRollNo olsun.
// localhost:3000/students/100 
app.route("/students/:studentRollNo")
.get(function(req, res){
    Student.findOne({rollno: req.params.studentRollNo}, function(err, foundStudent){
        if(!err){
            res.send(foundStudent);
        }else{ 
            res.send("No student matching that name was found.");
        }
    });
})
.put(function (req, res) {  
    console.log("inside put method");
    Student.updateOne(
        //look for this
        {rollno: req.params.studentRollNo}, 
        //replace with these 
        {rollno : req.body.rollno, address: req.body.address, name: req.body.name},
        {overwrite: false},
        function (err) {
        if(!err){
            res.send("Successfully updated a student.");
        }
        else{
            res.send("Failed to update a student!");
        }
    });
})
.patch(function (req, res) {
    Student.updateOne(
        {rollno: req.params.studentRollNo},
        {$set: req.body},
        function (err) {
            if(!err){
                res.send("Successfully updated student.");
            }else{
                res.send(err);
            }
        }
    );
})
.delete(function(req, res){
    Student.deleteOne(
        {rollno: req.params.studentRollNo},
        function (err) {  
            if(!err){
                res.send("Successfully deleted a student.");
            }else{
                res.send(err);
            }
        }
    );
});


app.listen(3000, function () {
    console.log("Server is running on port 3000.");
});
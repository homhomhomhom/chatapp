// const express = require('express');
// const app = express();
// var server = app.listen((process.env.PORT || 4001), function(){ console.log('APP Loaded!'); });
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });



// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });
const db = require('./queries');
const express = require('express');
const app = express();  
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;


app.use(express.static(__dirname + '/public'));


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html');
});

app.get('/swift', (req, res) => {
    res.sendFile(__dirname + '/public/swift.html');
});

app.get('/css', (req, res) => {
    res.sendFile(__dirname + '/public/css.html');
});


// tech namespace
const tech = io.of('/tech');

tech.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);

        db.getChats(data.room).then( val => {
            
            tech.to(socket.id).emit('historyChats',val);
            
            tech.in(data.room).emit('singleMessage', `${data.user} joined ${data.room} room!`)

        // tech.in(data.room).emit('message', `New user joined ${data.room} room!`);

        });
    });

    socket.on('message', (data) => {
        console.log(`message ${data.msg}`);

        var message = {
            user: data.user,
            room: data.room,
            msg: data.msg
        };
        let insert = db.insertChats(message);
        tech.in(data.room).emit('message', message);
    })

    // socket.on('message', (data) => {
    //     console.log(`message: ${data.msg}`);
        
        
    //     tech.in(data.room).emit('message', data.msg);
    //     db.insertChats(data);
    //     db.getChats.then((res) => console.log(res))
    // });

    socket.on('disconnect', () => {
        console.log('user disconnected');

        tech.emit('message', 'user disconnected');  
    });
});


// const express = require('express');
// const app = express();
// var server = app.listen((process.env.PORT || 4001), function(){ console.log('APP Loaded!'); });
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


// //
// app.get('/', (req, res) => {

//     res.send('ok hij doet t...');

// });
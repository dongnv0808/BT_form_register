const http = require('http');
const fs = require('fs');
const qs = require('qs');

let listUser = [];
let display = "";
let i = 0;
let server = http.createServer((req, res) => {
    if(req.method === 'GET'){
        fs.readFile('./views/register.html', (err, data) => {
            if(err){
                res.writeHead(404,{'Content-Type':'text/html'});
                return res.end('404 not found');
            }
            res.writeHead(200, {'Content-Type':'text/html'});
            res.write(data);
            res.end();
        })
    } else {
        let data = "";
        req.on("data", chunk => {
            data += chunk;
        });
        req.on('end', () => {
            let userInfo = qs.parse(data);
            listUser.push(userInfo);
            console.log(listUser);
            fs.readFile('./views/register.html', 'utf-8', (err, datahtml) => {
                if(err){
                    console.log('err');
                }
                display += `<tr>
                    <td>STT</td>
                    <td>${i}</td>
                </tr>
                <tr>
                    <td>Name:</td>
                    <td>${userInfo.name}</td>
                </tr>
                <tr>
                    <td>Email:</td>
                    <td>${userInfo.email}</td>
                </tr>
                <tr>
                    <td>Phone:</td>
                    <td>${userInfo.phone}</td>
                </tr>
                <tr>
                    <td>Address:</td>
                    <td>${userInfo.address}</td>
                </tr>`
                datahtml = datahtml.replace('{listuser}', display);
                res.writeHead(200, {'Content-Type':'text/html'});
                res.write(datahtml);
                return res.end();
            })
            i++;
        });
        req.on('err', () => {
            console.log(err)
        });
    }
})
server.listen(8080, () => {
    console.log('Server running in localhost:8080');
})
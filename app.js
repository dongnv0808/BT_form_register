const http = require('http');
const fs = require('fs');
const qs = require('qs');
const formidable = require('formidable');
let listUser = [];
let display = "";
let i = 0;
let server = http.createServer((req, res) => {
    const url = req.url;
    const fileName = url.split('/')[2];
    const suffix = url.split('.')[1];
    switch(suffix){
        case 'png': {
            fs.readFile(`upload/${fileName}`, (err, data) => {
                res.writeHead(200, {'Content-Type': 'image/png'});
                res.write(data);
                return res.end();
            })
            break;
        }
        case 'jpg': {
            fs.readFile(`upload/${fileName}`, (err, data) => {
                res.writeHead(200, {'Content-Type': 'image/jpg'});
                res.write(data);
                return res.end();
            })
            break;
        }
        case 'css': {
            fs.readFile(`css/${fileName}`, (err, data) => {
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.write(data);
                return res.end();
            })
            break;
        }
        default: {
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
                let form = new formidable.IncomingForm();
                form.uploadDir = "upload/";
                form.parse(req, (err, fields, files) => {
                    let userInfo = {
                        name: fields.name,
                        email: fields.email,
                        phone: fields.phone,
                        address: fields.address,
                    };
                    
                    if(err){
                        console.error(err.message);
                        return res.end(err.message);
                    }
                    
                    let tmpPath = files.avatar.filepath;
                    let newPath = form.uploadDir + files.avatar.originalFilename;
                    userInfo.avatar = newPath;
                    fs.rename(tmpPath, newPath, (err) => {
                        if(err) throw err;
                        let fileType = files.avatar.mimetype;
                        let mimeType = ['image/jpeg', 'image/jpg', 'image/png'];
                        if(mimeType.indexOf(fileType) === -1){
                            res.writeHead(200, {'Content-Type':'text/html'});
                            return res.end('The file is not in the correct format: png, jpeg, jpg');
                        }
                        listUser.push(userInfo);
                        console.log(listUser);
                    })
                    fs.readFile('./views/register.html', 'utf-8', (err, datahtml) => {
                        if(err){
                            console.log(err);
                        }
                        for(let i = 0; i < listUser.length; i++){
                            display += `<tr>
                                <td>Name:</td>
                                <td>${listUser[i].userInfo.name}</td>
                            </tr>
                            <tr>
                                <td>Email:</td>
                                <td>${listUser[i].userInfo.email}</td>
                            </tr>
                            <tr>
                                <td>Phone:</td>
                                <td>${listUser[i].userInfo.phone}</td>
                            </tr>
                            <tr>
                                <td>Adress:</td>
                                <td>${listUser[i].userInfo.address}</td>
                            </tr>
                            <tr>
                                <td>Avatar:</td>
                                <td><img src="./${listUser[i].userInfo.avatar}" width="200px" height="200px" alt=""></td>
                            </tr>`
                        }
                        datahtml = datahtml.replace("{listuser}",display);
                        res.writeHead(200, {'Content-Type':'text/html'});
                        res.write(datahtml);
                        return res.end();
                    })
                })
            }
            break;
        }
    }
})
server.listen(8080, () => {
    console.log('Server running in localhost:8080');
})
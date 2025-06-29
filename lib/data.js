const fs = require('fs');
const path = require('path');

const lib = {}

lib.basedir = path.join(__dirname, '../.data/')

// write data to file
lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (error, fileDescriptor) => {
        if (!error && fileDescriptor) {

            const stringData = JSON.stringify(data)

            fs.writeFile(fileDescriptor, stringData, (err) => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false)
                        }
                        else {
                            callback('error to closing the file')
                        }
                    })
                }
                else {
                    callback('error to write file')
                }
            })
        }
        else {
            callback('there are is an error, this file may be already existe')
        }
    })
}

// read data
lib.read=(dir,file,callback)=>{
    fs.readFile(`${lib.basedir + dir}/${file}.json`,'utf8',(err,data)=>{
        callback(err,data)
    })
}

// update file
lib.update=(dir,file,data,callback)=>{
    fs.open(`${lib.basedir + dir}/${file}.json`,'r+',(error,fileDescriptor)=>{
        if(!error && fileDescriptor){
            fs.ftruncate(fileDescriptor,(err)=>{
                if(!err){
                    const stringData = JSON.stringify(data)
                    fs.writeFile(fileDescriptor,stringData,(err)=>{
                        if(!err){
                            fs.close(fileDescriptor,(err)=>{
                                if(!err){
                                    callback(false)
                                }
                                else{
                                    callback('error to closing the file')
                                }
                            })
                        }
                        else{
                            callback('error writing to file')
                        }
                    })
                }
                else{
                    callback('error in ftruncate file')
                }
            })
        }
        else{
            callback('there is an error file can not to be update')
        }
    })
}

// delete file
lib.delete=(dir,file,callback)=>{
    fs.unlink(`${lib.basedir + dir}/${file}.json`,(err)=>{
        if(!err){
            callback(false)
        }
        else{
            callback('error to delete the file')
        }
    })
}
module.exports = lib
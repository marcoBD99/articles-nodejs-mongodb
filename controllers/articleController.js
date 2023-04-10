'use strict'
var validator = require('validator')
var ArticleModel= require('../models/article');
var fs = require('fs');
var path = require('path');

var controller={
    
    datosCurso: (req,res)=>{
        return res.status(200).send({
            curso:'Curso de NodeJS',
            autor:'Marco Barajas',
            url:'http://localhost:3900'
        })
    },

    test:(req,res)=>{
        return res.status(200).send({
            message:'Soy el test de controller'
        })
    },

    save :(req,res)=>{
        console.log(req.body);
        var body = req.body;

        try{
            var validate_title = !validator.isEmpty(body.title);
            var validate_content = !validator.isEmpty(body.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message:'Faltan datos por enviar!!'
            });
        }

        if (validate_title && validate_content){
            var article = new ArticleModel();
            article.title=body.title;
            article.content=body.content;
            article.image=null;
            article.save()
                    .then(article => {
                        console.log("The article has been added.");
                        return res.status(200).send({status:'success',article:article})
                    })
                    .catch(err => {
                        console.log('The article has no been added.'+err);
                        return res.status(404).send({
                            status: 'error',
                            message:'El articulo no se ha guardado!'
                        });
                    })
        }else{
            return res.status(200).send({
                status: 'error',
                message:'Los datos no son validos!'
            });
        }
    },

    getArticles: (req,res) => {
        
        ArticleModel.find({}).exec().then(articles => {
            console.log("Return article.");
            return res.status(200).send({status:'success',articles})
        })
        .catch(err => {
            return res.status(404).send({
                status: 'error',
                message:'error al retornar articulos'
            });
        })  
    },

    getArticle:(req,res) => {
        var articleId = req.params.id;
        console.log(articleId)
        if (!articleId || articleId==null){
            return res.status(404).send({status:'error',message:'no hay articulos por mostrar'});
        }
        ArticleModel.findById(articleId).then(article =>{
            return res.status(200).send({status:'success',article})
        })
        .catch(err => {
            return res.status(500).send({status:'error',error:err})
        }) 
        
    },

    updateArticle:(req,res) => {
        var articleId = req.params.id;
        var bodyParams = req.body;

        try{
            var validate_title = !validator.isEmpty(bodyParams.title);
            var validate_content = !validator.isEmpty(bodyParams.content);
        }catch(err){
            return res.status(200).send({
                status: 'error',
                message:'Faltan datos por enviar!!'
            });
        }

        if (validate_title && validate_content){
            ArticleModel.findByIdAndUpdate({_id:articleId},bodyParams,{new:true}).then(articleUpdate =>{

                if(!articleUpdate){
                    return res.status(200).send({
                        status: 'warning',
                        message:'Articulo, no existe',
                        articleUpdate
                    });    
                }

                return res.status(200).send({
                    status: 'success',
                    message:'Actualizacion correcta',
                    articleUpdate
                });
            })
            .catch(error =>{
                return res.status(500).send({
                    status: 'error',
                    message:'Error al actualizar'
                });
            })
        }else{
            return res.status(200).send({
                status: 'error',
                message:'La validacion no es correcta'
            });
        }


    },
    deleteArticle: (req,res) =>{

        var articleId = req.params.id;

        ArticleModel.findByIdAndDelete({_id:articleId}).then(artitleDelete =>{

            if(!artitleDelete){
                return res.status(404).send({
                    status: 'warning',
                    message:'Articulo, no encontrado!',
                    artitleDelete
                });    
            }

            return res.status(200).send({
                status: 'success',
                message:'Eliminacion correcta',
                artitleDelete
            });
        })
        .catch(error =>{
            return res.status(500).send({
                status: 'error',
                message:'Error al eliminar'
            });
        })
        .finally(() => {ArticleModel.db.close();}); 

    },

    uploadImage: (req,res) =>{
        var articleId = req.params.id;
        var file_path = req.files.file0.path;
        var file_split_path = file_path.split('/');
        var file_name = file_split_path[2];
        var file_split_extension = file_name.split('\.')
        var file_extension = file_split_extension[1];
        
        if (file_extension !='png' && file_extension !='jpg' && file_extension !='jpeg' && file_extension !='gif'){
            fs.unlink(file_path,(err)=>{
                return res.status(200).send({
                    status:'error',
                    message:'La extension de la imagen no es valida'
                });
            });
        }else{
            ArticleModel.findOneAndUpdate({_id:articleId},{image:file_name},{new:true}).then(articleUpdate => {    
                return res.status(200).send({
                    status:'success',
                    message:'Se actualizo la imagen correctamente',
                    articleUpdate
                });
            })
            .catch(err => {
                return res.status(500).send({
                    status:'error',
                    message:'Succedio un error al intentar actualizar la imagen del articulo',
                    err
                });
            })


        }
    },

    getImage: (req,res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;
        console.log(path_file)
        fs.exists(path_file,(exists)=>{
            console.log(exists)
            if (exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status:'error',
                    message:'La imagen no existe!'
                });
            }
        })
    },

    search: (req,res) => {
        var searchString = req.params.search;

        ArticleModel.find({
            "$or":[
                {"title":{"$regex":searchString,"$options":"i"}},
                {"content":{"$regex":searchString,"$options":"i"}}
            ]})
            .sort([['date','descending']])
            .exec()
            .then(articles =>{
                return res.status(200).send({
                    status:'success',
                    articles
                });
            })
            .catch(error => {
                return res.status(500).send({
                    status:'error',
                    message:'sucedio un error en la busqueda'
                });
            })

    }

};
module.exports = controller;
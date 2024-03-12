const express = require('express');
const bodyParser = require('body-parser');
/* const mysql = require('mysql'); */
const path = require('path')
const mysql2 = require('mysql2/promise')
const controlador = express()
const session=require('express-session'); //Configurar middleware
const req = require('express/lib/request');
const { Script } = require('vm');
const { channel } = require('diagnostics_channel');



controlador.use(bodyParser.urlencoded({ extended: true }));
controlador.use(bodyParser.json());
controlador.use(express.static(path.join(__dirname, "public")));
controlador.use('/css', express.static(path.join(__dirname,"../Vistas/CSS")));
controlador.use('/imagenes', express.static(path.join(__dirname,'../Vistas/IMAGENES')));
controlador.use(session({
    secret:'nata',//cadena secreta para guaradar el id de las cookies de la sesion UNICA
    resave:false,//indica si se debe volver a guardara la sesion o no, pide las cookies o no 
    saveUninitialized:false//saber si hay una sesion vavio o no si es true se quiere decir que se necesita crear sesion para cada uno de los usuarios

})) 
//Mysql Versión 1.0
/* const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'manzanas'
})
db.connect((err)=>{
    if(err){
        console.error('Error al conectar a la base de datos'+ err.stack)
        return;
    }
    console.log('Conexión exitosa a la base de datos')
}); */
//Mysql Versión 2.0

const db2 = ({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'manzaa',
  /*  port:'3308', *///Eliminar en casa por que no es el puerto predeterminado o ponerle 3306 
    timezone:'America/Bogota'
});

controlador.post('/crear', async (req, res) => {
    const { Tipo_Documen, Documento, Nombres, Apellidos, Tel, Correo_Elec, Ciudad, Direccion, Ocupacion,FkManzana } = req.body
    try {
        
        const bbdd=await mysql2.createConnection(db2)
        const [indicador] = await bbdd.execute('SELECT * FROM  mujeres WHERE  Documento = ? ', [Documento])
        if (indicador.length > 0) {
            res.status(401).send(`
            <script>
                window.onload= function() {
                    alert('Ya existe el usuario');
                    window.location.href='../Vistas/HTML/iniciaa.html';
                }
           </script>`
            )
           
        }
        else {
            bbdd.execute('INSERT INTO mujeres(Tipo_Documen, Documento, Nombres, Apellidos, Tel, Correo_Elec, Ciudad, Direccion, Ocupacion,FkManzana) VALUES(?,?,?,?,?,?,?,?,?,?)',
                [Tipo_Documen, Documento, Nombres, Apellidos, Tel, Correo_Elec, Ciudad, Direccion, Ocupacion,FkManzana])
            res.status(201).send(`
            <script>
            window.onload= function() {
                alert('Registrado');
                window.location.href='../Vistas/HTML/iniciaa.html';}
            </script>`)
        }
        await bbdd.end();
    }
    catch (error) {
        console.error('Error en el servidor: ', error)
        res.status(500).send("No se pudo enviar")
    }
})
//ruta para manejar login
controlador.post('/iniciar', async (req, res) => {
    const { Tipo_Documen, Documento } = req.body
    try {
        const bbdd=await mysql2.createConnection(db2)
        const [indicador] = await bbdd.execute('SELECT * FROM  mujeres WHERE Tipo_Documen= ? OR Documento = ? ', [Tipo_Documen, Documento])
        console.log(indicador)
        if (indicador.length > 0) {
            req.session.usuario=indicador[0].Nombres;
            req.session.Documento=Documento;
            if(indicador[0].ROL=="administrador"){
                res.sendFile(path.join(__dirname, '../Vistas/HTML/admin.html'))
            }
            else{
                const usuario={nombre:indicador[0].Nombres}
                console.log(usuario)
                res.locals.usuario=usuario
            res.sendFile(path.join(__dirname, '../Vistas/HTML/usuario.html'))
        }
    }
        else {
            res.status(409).send("USUARIO NO ENCONTRADO")
        }
        
       await bbdd.end();
    }
    catch (error) {
        console.log("error en el servidor", error)
        res.status(500).send(`
                <script>
                window.onload= function() {
                    alert('Error en el servidor');
                    window.location.href = '../Vistas/HTML/iniciaa.html';
                }
</script>`
        )
    }
})
controlador.post('/obtener-usuario', (req, res) => {
    const usuario=req.session.usuario;
    if(usuario){
        res.json({Nombres:usuario})
        res.sendFile(__dirname, '../Vistas/HTML/usuario.html')
    }
  else{
    res.status(401).send('Usuario no identificado')
  }
})
controlador.post('/obtener-servicios-usuario', async (req, res) => {
    Documento=req.session.Documento;
    console.log(Documento)
    try {
        const bbdd=await mysql2.createConnection(db2)
        const [serviciosData] = await bbdd.execute('SELECT servicio.Nom_serv FROM mujeres INNER JOIN manzanas ON mujeres.FkManzana = manzanas.Cod_Manzana INNER JOIN manzanas_servicio ON manzanas.Cod_Manzana = manzanas_servicio.Id_manzana1 INNER JOIN servicio ON manzanas_servicio.servicioCod_Serv = servicio.Cod_Serv WHERE mujeres.Documento = ?', [Documento])
        console.log(serviciosData)
        res.json({ servicios: serviciosData.map(row => row.Nom_serv) })
       await bbdd.end()
    }
    catch (error) {
        console.error('Error en el servidor', error);
        res.status(500).send('Error en el servidor')

    }
}
)
controlador.post('/guardar-servicios-usuario', async(req,res)=>{
    const {servicios, fechaHora}=req.body
    const Documento=req.session.Documento;
    const bbdd=await mysql2.createConnection(db2);
    const [SacarID]=await bbdd.execute('SELECT Id_Mujer FROM mujeres WHERE Documento=?',[Documento])
    const [sacarCodServ]=await bbdd.query('SELECT servicio.Cod_Serv FROM servicio WHERE servicio.Nom_Serv=?',[servicios])
    console.log(SacarID)
    console.log(sacarCodServ)
    try{
        for(const servicio of servicios){
            await bbdd.execute('INSERT INTO solicitudes (Hora,servicio,FkMujeres) VALUES (?,?,?)',[fechaHora, sacarCodServ[0].Cod_Serv,SacarID[0].Id_Mujer])    
            res.status(200).send('Chipi chapa')
        }
        await bbdd.end();       
        }
        catch{
            console.error('Error en el servidor', error)
            res.status(500).send('Error en el servidor')
        }
})
controlador.post('/lista-servicios-select',async(req,res )=>{
    const usuario=req.session.usuario;
    try{
    const bbdd=await mysql2.createConnection(db2)
    const[lista_serv]= await bbdd.execute('SELECT solicitudes.Hora, servicio.Nom_Serv, servicio.Cod_Serv FROM solicitudes INNER JOIN mujeres ON mujeres.Id_Mujer = solicitudes.FkMujeres  INNER JOIN manzanas ON manzanas.Cod_Manzana = mujeres.FkManzana INNER JOIN manzanas_servicio ON manzanas_servicio.Id_Manzana1= manzanas.Cod_Manzana INNER JOIN servicio ON servicio.Cod_Serv= manzanas_servicio.servicioCod_Serv WHERE mujeres.Nombres=? AND solicitudes.servicio=servicio.Cod_Serv',[usuario])
    console.log(lista_serv)

    res.json({
        lis_select: lista_serv.map(row=>([
            row.Hora,
            row.Nom_Serv,
            row.Cod_Serv
        ]))
    })
    await bbdd.end();
    }
    catch  (error){
        console.error('Error en el servidor', error);
        res.status(500).send('Error en el servidor')
    }
})
controlador.delete('/eliminar-consulta',async(req,res)=>{
    const{deleteb,fecha_Servi}=req.body
    try{
    const bbdd=await mysql2.createConnection(db2)
    const[delete_con]=await bbdd.execute('DELETE FROM solicitudes WHERE servicio=? AND Hora=?',[deleteb, fecha_Servi])
    console.log(fecha_Servi)
    console.log(delete_con)
    res.json({delete_con})
    await bbdd.end();
}
    catch  (error){
        console.error('Error en el servidor', error);
        res.status(500).send('Error al eliminar datos')
    }
    
}) 

controlador.post('/Manzanita', async (req, res) => {
    const { Nombre_Manzana,Localidad,Direccion,Municipio } = req.body
    try {
        const bbdd=await mysql2.createConnection(db2)
        const [Crear_manza] = await bbdd.execute('INSERT INTO manzanas(Nombre_Manzana,Localidad,Direccion,Municipio) VALUES (?,?,?,?)', [Nombre_Manzana,Localidad,Direccion,Municipio])
        console.log(Crear_manza)
   res.status(200).send(`<Script>
   window.onload= function() {
    alert('Manzana agregada');
    window.location= '../Vistas/HTML/adminn.html';
}
   </Script>`)
   await bbdd.end();
    }
    catch (error) {
        console.error('Error en el servidor: ', error)
        res.status(500).send("No se pudo enviar")
    }
})
controlador.post('/Servicios', async (req, res) => {
    const { Nom_Serv,Descripc,Categ_Serv,Tipo_Serv } = req.body
    try {
        const bbdd=await mysql2.createConnection(db2)
        const [servicios] = await bbdd.execute('INSERT INTO servicio(Nom_Serv,Descripc,Categ_Serv,Tipo_Serv) VALUES (?,?,?,?)', [Nom_Serv,Descripc,Categ_Serv,Tipo_Serv])
        console.log(servicios)
   res.status(200).send(`<Script>
   window.onload= function() {
    alert('Servicio agregado');
    window.location= '../Vistas/HTML/adminn.html';
}
   </Script>`)
   await bbdd.end();
    }
    catch (error) {
        console.error('Error en el servidor: ', error)
        res.status(500).send("No se pudo enviar")
    }
})

controlador.post('/admin', async (req, res) => {
    const admins = path.join(__dirname, '../Vistas/HTML/admin.html')
    res.sendFile(admins)
})

controlador.get('/Vistas/HTML/adminn.html', async (req, res) => {
    const admins = path.join(__dirname, '../Vistas/HTML/adminn.html')
    res.sendFile(admins)
})


controlador.get('/obtener-manzana-admins', async (req, res) => {
    try {
        const bbdd=await mysql2.createConnection(db2)
        const [obtener_manzana] = await bbdd.execute('SELECT * FROM manzanas')
        console.log(obtener_manzana)
        const manzanass=obtener_manzana.map(tablaadmin=>({
            Cod_Manzana:tablaadmin.Cod_Manzana,
            Nombre_Manzana:tablaadmin.Nombre_Manzana,
            Localidad: tablaadmin.Localidad,
            Direccion: tablaadmin.Direccion,
            Municipio: tablaadmin.Municipio,
          
    }))
    res.json({tabla:manzanass})
        await bbdd.end();
        await bbdd.end();
    }
    catch (error) {
        console.error('Error en el servidor: ', error)
        res.status(500).send("No se pudo enviar")
    }
})

controlador.get('/obtener-usuario-admins', async (req, res) => {
    try {
        const bbdd=await mysql2.createConnection(db2)
        const [mujeres] = await bbdd.execute('SELECT * FROM mujeres')
        console.log(mujeres)
        const usuarios=mujeres.map(tablaausua=>({
                idusu:tablaausua.Id_Mujer,
                Tipo_Documen:tablaausua.Tipo_Documen,
                Documento: tablaausua.Documento,
                Nombres: tablaausua.Nombres,
                Apellidos: tablaausua.Apellidos,
                Tel: tablaausua.Tel,
                Correo_Elec:tablaausua.Correo_Elec,
                Ciudad:tablaausua.Ciudad,
                Direccion:tablaausua.Direccion,
                Ocupacion:tablaausua.Ocupacion,
                ROL:tablaausua.ROL,
                FkManzana: tablaausua.FkManzana
        }))
        res.json({tablausuario:usuarios})
            await bbdd.end();
    }
    catch (error) {
        console.error('Error en el servidor: ', error)
        res.status(500).send("No se pudo enviar")
    }
})
controlador.post('/usuarioss/:idusu', async (req, res) => {
    const idusu=req.params.idusu;
    const bbdd=await mysql2.createConnection(db2)
    try{
    const [consultaUsuario] = await bbdd.execute('SELECT * FROM mujeres WHERE Id_Mujer = ?', [idusu]);
        if (consultaUsuario.length > 0) {
            res.sendFile(path.join(__dirname,'../vistas/HTML/actualizar.html'));
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
        await bbdd.end();
    } catch (error) {
        console.error('Error en el servidor', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})
controlador.post('/servicioss/:id', async (req, res) => {
    const id=req.params.id;
    const bbdd=await mysql2.createConnection(db2)
    try{
    const [consultaserv] = await bbdd.execute('SELECT * FROM servicio WHERE Cod_Serv = ?', [id]);
        if (consultaserv.length > 0) {
            res.sendFile(path.join(__dirname,'../vistas/HTML/actualizarservicio.html'));
        } else {
            res.status(404).json({ error: 'Servicio no encontrado' });
        }
        await bbdd.end();
    } catch (error) {
        console.error('Error en el servidor', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})
controlador.post('/manzanass/:Cod_Manzana', async (req, res) => {
    const Cod_Manzana=req.params.Cod_Manzana;
    const bbdd=await mysql2.createConnection(db2)
    try{
    const [consultaManza] = await bbdd.execute('SELECT * FROM manzanas WHERE Cod_Manzana = ?', [Cod_Manzana]);
        if (consultaManza.length > 0) {
            res.sendFile(path.join(__dirname,'../Vistas/HTML/actualizarmanza.html'));
        } else {
            res.status(404).json({ error: 'Manzana no encontrada' });
        }
        await bbdd.end();
    } catch (error) {
        console.error('Error en el servidor', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
})
controlador.get('/vistas/HTML/actualizar.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'../vistas/HTML/actualizar.html'))
})
controlador.get('/vistas/HTML/inicia.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'../vistas/HTML/inicia.html'))
})
/* controlador.post('/edit-usuario', async (req, res) => {
       const usuarioID=req.session.idusu;
      const {Tipo_Documen, Tel, Correo_Elec, Ciudad, Direccion, Ocupacion}=req.body
      try {
          const bbdd=await mysql2.createConnection(db2)
          const [update]= await bbdd.execute('UPDATE mujeres SET Tipo_Documen=?, Tel=?, Correo_Elec=?, Ciudad=?, Direccion=?, Ocupacion=? WHERE Id_Mujer=?',[Tipo_Documen, Tel, Correo_Elec, Ciudad, Direccion, Ocupacion, usuarioID])
          console.log(update)
     await bbdd.end();
      }
      catch (error) {
          console.error('Error al actualizar usuario: ', error)
          res.status(500).send("No se pudo actualizar usuario")
      }}) */
      controlador.post('/edit-usuario/:idusu', async (req, res) => {
        
        try {
            const idusu= req.params.idusu;
            const { Tipo_Documen, Tel, Correo_Elec, Ciudad, Direccion, Ocupacion } = req.body;
            const bbdd = await mysql2.createConnection(db2);
            const [update] = await bbdd.execute('UPDATE mujeres SET Tipo_Documen=?, Tel=?, Correo_Elec=?, Ciudad=?, Direccion=?, Ocupacion=? WHERE Id_Mujer=?',[Tipo_Documen, Tel, Correo_Elec, Ciudad, Direccion, Ocupacion, idusu])
           console.log(update)
            res.status(201).send(`
            <script>
            window.onload= function() {
                alert('Usuario actualizado');
                window.location.href='../Vistas/HTML/adminn.html';}
            </script>`)   
            await bbdd.end();
        } catch (error) {
            console.error('Error al actualizar usuario: ', error);
            res.status(500).send("No se pudo actualizar usuario");
        }
    });
   
    controlador.post('/editar-servicio/:id', async (req, res) => {
        
        try {
            const id= req.params.id;
            const { Nom_Serv,Descripc,Categ_Serv,Tipo_Serv } = req.body
            const bbdd = await mysql2.createConnection(db2);
            const [updateserv] = await bbdd.execute('UPDATE servicio SET Nom_Serv=?, Descripc=?, Categ_Serv=?, Tipo_Serv=? WHERE Cod_Serv=?',[Nom_Serv,Descripc,Categ_Serv, Tipo_Serv, id])
           console.log(updateserv)
            res.status(201).send(`
            <script>
            window.onload= function() {
                alert('Servicio actualizado');
                window.location.href='../Vistas/HTML/adminn.html';}
            </script>`)   
            await bbdd.end();
        } catch (error) {
            console.error('Error al actualizar usuario: ', error);
            res.status(500).send("No se pudo actualizar usuario");
        }
    });
    controlador.post('/editar-manzanas/:Cod_Manzana', async (req, res) => {
        
        try {
            const Cod_Manzana= req.params.Cod_Manzana;
            const { Nombre_Manzana,Localidad,Direccion,Municipio } = req.body
            const bbdd = await mysql2.createConnection(db2);
            const [updateserv] = await bbdd.execute('UPDATE manzanas SET Nombre_Manzana=?, Localidad=?, Direccion=?, Municipio=? WHERE Cod_Manzana=?',[Nombre_Manzana,Localidad,Direccion,Municipio, Cod_Manzana])
           console.log(updateserv)
            res.status(201).send(`
            <script>
            window.onload= function() {
                alert('Manzana actualizada');
                window.location.href='../Vistas/HTML/adminn.html';}
            </script>`)   
            await bbdd.end();
        } catch (error) {
            console.error('Error al actualizar usuario: ', error);
            res.status(500).send("No se pudo actualizar usuario");
        }
    });
controlador.get('/obtener-servicio-admins', async (req, res) => {
    const usuario=req.session.usuario;
    try {
        const bbdd=await mysql2.createConnection(db2)
        const [obtenerserv] = await bbdd.execute('SELECT * FROM servicio')
        console.log(obtenerserv)
        const servicios=obtenerserv.map(tablaserv=>({
        id:tablaserv.Cod_Serv,
        Nombre:tablaserv.Nom_Serv,
        Categoria: tablaserv.Categ_Serv,
        Tipo: tablaserv.Tipo_Serv
    }))
    res.json({tablaservicio:servicios})
        await bbdd.end();
    }
    catch (error) {
        console.error('Error en el servidor: ', error)
        res.status(500).send("No se pudo enviar")
    }
})

controlador.delete('/eliminar-servicio/:id', async (req, res) => {
    const servicioID=req.params.id;
    try {
        const bbdd=await mysql2.createConnection(db2)
  const [Eliminar_manserv]= await bbdd.execute('DELETE FROM manzanas_servicio WHERE servicioCod_Serv = ?',[servicioID])
  const [eliminarservs]=await bbdd.execute('DELETE FROM servicio WHERE Cod_Serv = ?;',[servicioID])
  res.status(200).send(`<Script>
 window.onload= function() {
  alert('Usuario eliminado');
  window.location= '../Vistas/HTML/adminn.html';
}
 </Script>`)
  console.log(Eliminar_manserv,eliminarservs)
        await bbdd.end();
    }
    catch (error) {
        console.error('Error al eliminar sercicio: ', error)
        res.status(500).send("Error al eliminar sercicio")
    }
})
controlador.delete('/eliminar-usuario/:idusu', async (req, res) => {
    const usuarioID=req.params.idusu;
    try {
        console.log(usuarioID)
        const bbdd=await mysql2.createConnection(db2)
 const [eliminarusuarios]=await bbdd.execute('DELETE FROM solicitudes WHERE FkMujeres = ?',[usuarioID])
  const [Eliminar_usu]= await bbdd.execute('DELETE FROM mujeres WHERE Id_Mujer =?',[usuarioID])
 res.status(200).send(`<Script>
 window.onload= function() {
  alert('Usuario eliminado');
  window.location= '../Vistas/HTML/adminn.html';
}
 </Script>`)
  console.log(Eliminar_usu,eliminarusuarios)
        await bbdd.end();
    }
    catch (error) {
        console.error('Error al eliminar usuario: ', error)
        res.status(500).send("Error al eliminar usuario")
    }
})
controlador.post('/cerrar-sesion',(req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.error('Error al cerrar sesión')
            res.status(500).json('Error al cerrar sesión');
        }
        else{
            res.sendFile(path.join(__dirname,'../vistas/HTML/inicioo.html'))
        }
    })
});
controlador.get('/Vistas/HTML/inicioo.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'../Vistas/HTML/inicioo.html'))
})
controlador.get('/Vistas/HTML/registroo.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'../Vistas/HTML/registroo.html'))
})
controlador.get('/Vistas/HTML/servicios.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'../Vistas/HTML/servicios.html'))
})
controlador.get('/Vistas/HTML/actualizarservicio.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'../Vistas/HTML/actualizarservicio.html'))
})
controlador.get('/Vistas/HTML/actualizarmanza.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'../Vistas/HTML/actualizarmanza.html'))
})
controlador.get('/Vistas/HTML/manzana.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'../Vistas/HTML/manzana.html'))
})
controlador.get('/Vistas/HTML/actualizar.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'../Vistas/HTML/actualizar.html'))
})
controlador.get('/Vistas/HTML/iniciaa.html',(req,res)=>{
    res.sendFile(path.join(__dirname,'../Vistas/HTML/iniciaa.html'))
})
controlador.post('/editar-usuario/', async (req, res) => {
    const usuarioID=req.params.idusu;
    const Tipo_Documen=req.params.Tipo_Documen;
    const Documento=req.params.Documento;
    const Nombres=req.params.Nombres;
    const Apellidos=req.params.Apellidos;
    const Tel=req.params.Tel;
    const Correo_Elec=req.params.Correo_Elec;
    const Ciudad=req.params.Ciudad;
    const Direccion=req.params.Direccion;
    const Ocupacion=req.params.Ocupacion;
    const ROL=req.params.ROL;
    const FkManzana=req.params.FkManzana;
    try {
        const registro=path.join(__dirname, "../Vistas/HTML/registro.html") 
   res.sendFile(registro)
        const bbdd=await mysql2.createConnection(db2)
const [update]= await bbdd.execute('UPDATE mujeres SET Tipo_Documen=?, Documento=?, Nombres=?, Apellidos=?, Tel=?, Correo_Elec=?, Ciudad=?, Direccion=?, Ocupacion=?, ROL=?,FkManzana=? WHERE Id_Mujer=?',[Tipo_Documen, Documento, Nombres, Apellidos, Tel, Correo_Elec, Ciudad, Direccion, Ocupacion,ROL,FkManzana,usuarioID])
  console.log(update)
        await bbdd.end();
        
    }
    catch (error) {
        console.error('Error al actualizar usuario: ', error)
        res.status(500).send("Error al actualizar usuario")
    }})
  
       controlador.post('/agregar_Servicio',async(req,res)=>{
       res.sendFile(path.join(__dirname,"../Vistas/HTML/admin.html"))
    });
   
    controlador.post('/agregar-man',async(req,res)=>{
        res.sendFile(path.join(__dirname,"../Vistas/HTML/admin.html"))
     });
   
    
controlador.listen(3000, () => {
    console.log('Servidor Nodemon escuchado')
});
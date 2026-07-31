const logger = (req , res,next)=>{
    const start = Date.now()  ;
    res.on("finish",()=>{
        const duration = Date.now() - start ;
         console.log(`${req.methode} ${req.originalUrl} ${res.statusCode} - ${duration}ms`)
});
next ();
    };
    export default logger ;
   
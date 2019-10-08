module.exports = app => {
    app.listen(app.get("port"), () => {
        console.log(`My Food API - Port ${app.get("port")}`);
    });
}

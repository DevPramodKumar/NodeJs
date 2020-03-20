var DataTables = require('../../config/DataTables');//Libs file
exports.user_list = function (req, res, next) {
    var query = {};
    var where = ' ';// where condition
    query.request = req; //All request
    query.response = res; // Response
    query.cols = '(TO_BASE64(Ledger_Id)) as En_Ledger_Id,Ledger_Id,ltm.Ledger_Type_Title,Email,Mobile,Reffer_Code, (select Username from ledger_master  where Ledger_Id =lm.Parent_User_Id) as Parent_User,Username,Gender,DOB,Is_Active,Is_Blocked,lm.Ledger_Type_Id';//For rendering columns
    query.table = ' ledger_master as lm inner join ledger_type_master as ltm on ltm.Ledger_Type_Id=lm.Ledger_Type_Id ' // Render From , We can use join too
    query.order_by = ' lm.Ledger_Id desc' //For ordering data
    if (req.body.name != '' && typeof req.body.name !== 'undefined') {
        where += " and Username like '%" + req.body.name + "%'";
    }
    if (req.body.mobile != '' && typeof req.body.mobile !== 'undefined') {
        where += " and Mobile like '%" + req.body.mobile + "%'";
    }
    if (req.body.email != '' && typeof req.body.email !== 'undefined') {
        where += " and Email like '%" + req.body.email + "%'";
    }
    if (req.body.user_type != '' && typeof req.body.user_type !== 'undefined') {
        where += " and Ledger_Type_Id=" + req.body.user_type;
    }
    if (req.body.reffer_code != '' && typeof req.body.reffer_code !== 'undefined') {
        where += " and Reffer_Code like '%" + req.body.reffer_code + "%'";
    }
    if (typeof req.body.parent_user !== 'undefined' && req.body.parent_user != '') {
        where += " and Parent_User_Id = (select Ledger_Id from ledger_master where Username like '%" + req.body.parent_user + "%')";
    }
    if (req.body.gender != '' && typeof req.body.gender !== 'undefined') {
        where += " and Gender =" + req.body.gender;
    }
    if (req.body.Is_Active != '' && typeof req.body.Is_Active !== 'undefined') {
        where += " and Is_Active =" + req.body.Is_Active;
    }
    if (req.body.Is_Blocked != '' && typeof req.body.Is_Blocked !== 'undefined') {
        where += " and Is_Blocked =" + req.body.Is_Blocked;
    }
    query.where = where;
    DataTables.Generate(query);
};
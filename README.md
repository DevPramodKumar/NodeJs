# NodeJs
Datatable Server Side In Node JS MySql
Its very sipmle tu use this article to use datatable server side proccessig. As mentioned in Example.js:
var query = {};
    var where = ' ';// where conditions
    query.request = req; //All request
    query.response = res; // Response
    query.cols = '(TO_BASE64(Ledger_Id)) as En_Ledger_Id,Ledger_Id,ltm.Ledger_Type_Title,Email,Mobile,Reffer_Code, (select Username from ledger_master  where Ledger_Id =lm.Parent_User_Id) as Parent_User,Username,Gender,DOB,Is_Active,Is_Blocked,lm.Ledger_Type_Id';//For rendering columns
    query.table = ' ledger_master as lm inner join ledger_type_master as ltm on ltm.Ledger_Type_Id=lm.Ledger_Type_Id ' // Render From , We can use join too
    Finaly we will call:
    DataTables.Generate(query);
    It will create  response very well as server side datatable

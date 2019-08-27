layui.use(['common', 'layer', 'dict', 'permission'], function() {
    var common = layui.common;
    var layer = layui.layer;
    var dict = layui.dict;
    var permission = layui.permission

    var userStatus = dict.showDictSelect("status", "userStatus", true);
    var pers = permission.checkPermission();

    var example;
    function init(){
        example =
            $('#dt-table').DataTable({
                "searching": false,
                "processing": false,
                "serverSide" : true,
                "language": {
                    "url": "/js/plugin/datatables/Chinese.lang"
                },
                "ajax": {
                    "url" : "/management/v1/vehicle/list",
                    "type":"post",
                    "contentType": "application/json",
                    "content-type": "application/json; charset=utf-8",
                    "data":function(d){

                        return JSON.stringify(d);
                    },
                    "dataSrc":function(json)
                    {
                        var newjson = {
                            recordsFiltered:json.content.total,
                            recordsTotal:json.content.total,
                            data:json.content.data
                        };
                        var returndata= {

                            "draw": 1,
                            "recordsTotal": 57,
                            "recordsFiltered": 57,
                            "data": [
                                {
                                    "first_name": "Airi",
                                    "last_name": "Satou",
                                    "position": "Accountant",
                                    "office": "Tokyo",
                                    "start_date": "28th Nov 08",
                                    "salary": "$162,700"
                                },
                                {
                                    "first_name": "Angelica",
                                    "last_name": "Ramos",
                                    "position": "Chief Executive Officer (CEO)",
                                    "office": "London",
                                    "start_date": "9th Oct 09",
                                    "salary": "$1,200,000"
                                },
                                {
                                    "first_name": "Ashton",
                                    "last_name": "Cox",
                                    "position": "Junior Technical Author",
                                    "office": "San Francisco",
                                    "start_date": "12th Jan 09",
                                    "salary": "$86,000"
                                },
                                {
                                    "first_name": "Bradley",
                                    "last_name": "Greer",
                                    "position": "Software Engineer",
                                    "office": "London",
                                    "start_date": "13th Oct 12",
                                    "salary": "$132,000"
                                },
                                {
                                    "first_name": "Brenden",
                                    "last_name": "Wagner",
                                    "position": "Software Engineer",
                                    "office": "San Francisco",
                                    "start_date": "7th Jun 11",
                                    "salary": "$206,850"
                                },
                                {
                                    "first_name": "Brielle",
                                    "last_name": "Williamson",
                                    "position": "Integration Specialist",
                                    "office": "New York",
                                    "start_date": "2nd Dec 12",
                                    "salary": "$372,000"
                                },
                                {
                                    "first_name": "Bruno",
                                    "last_name": "Nash",
                                    "position": "Software Engineer",
                                    "office": "London",
                                    "start_date": "3rd May 11",
                                    "salary": "$163,500"
                                },
                                {
                                    "first_name": "Caesar",
                                    "last_name": "Vance",
                                    "position": "Pre-Sales Support",
                                    "office": "New York",
                                    "start_date": "12th Dec 11",
                                    "salary": "$106,450"
                                },
                                {
                                    "first_name": "Cara",
                                    "last_name": "Stevens",
                                    "position": "Sales Assistant",
                                    "office": "New York",
                                    "start_date": "6th Dec 11",
                                    "salary": "$145,600"
                                },
                                {
                                    "first_name": "Cedric",
                                    "last_name": "Kelly",
                                    "position": "Senior Javascript Developer",
                                    "office": "Edinburgh",
                                    "start_date": "29th Mar 12",
                                    "salary": "$433,060"
                                }
                            ]
                        };
                        console.log(returndata);
                        return returndata;
                        //return newjson;
                    },
                    "error":function(xhr, textStatus, errorThrown){
                        var msg = xhr.responseText;
                        console.log(msg)
                    }
                },
                "dom": "<'dt-toolbar'r>t<'dt-toolbar-footer'<'col-sm-10 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-10' p v>>",
                "columns": [
                    { "data": "first_name", "defaultContent": ""},
                    { "data": "last_name", "defaultContent": ""}

                ],
                "order": [[ 0, "desc" ],[1, "asc"]]
            } );
    }

    $("#searchBt").click(function(){
        example.ajax.reload();
    });

    init();
});
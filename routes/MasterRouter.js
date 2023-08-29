const { db_Select } = require('../module/MasterModule');

const express = require('express'),
    MasterRouter = express.Router(),
    dateFormat = require('dateformat'),
    request = require('request');

MasterRouter.get('/location_list', async (req, res) => {
    const location = require('../location.json')
    // console.log(JSON.stringify(location));
    // var str = 'SynergicSoleMate2023@'
    // var enc_dt = Buffer.from(str, 'utf8').toString('base64')
    // var decode = Buffer.from(enc_dt, 'base64').toString();
    var res_dt = {suc: 1, msg: Buffer.from(JSON.stringify(location), 'utf8').toString('base64')}
    res.send(res_dt)
})

MasterRouter.get('/caste_list', async (req, res) => {
    var data = req.query
    var select = 'id, caste_name name', 
    table_name = 'md_caste_list',
    whr = data.id > 0 ? `id = ${id}` : null,
    order = 'ORDER BY caste_name';
    var res_dt = await db_Select(select, table_name, whr, order)
    res.send({suc:res_dt.suc, msg: res_dt.suc > 0 ? Buffer.from(JSON.stringify(res_dt.msg), 'utf8').toString('base64') : res_dt.msg })
})

MasterRouter.get('/gothram_list', async (req, res) => {
    var data = req.query
    var select = 'id, gothro_name name', 
    table_name = 'md_gothram',
    whr = data.id > 0 ? `id = ${id}` : null,
    order = 'ORDER BY gothro_name';
    var res_dt = await db_Select(select, table_name, whr, order)
    res.send({suc:res_dt.suc, msg: res_dt.suc > 0 ? Buffer.from(JSON.stringify(res_dt.msg), 'utf8').toString('base64') : res_dt.msg })
})

MasterRouter.get('/occupation_list', async (req, res) => {
    var data = req.query
    var new_arr = {}, res_data;
    var select = 'id, catg_name', 
        table_name = 'md_occu_catg',
        whr = data.id > 0 ? `id = ${id}` : null,
        order = 'ORDER BY catg_name';
    var res_dt = await db_Select(select, table_name, whr, order)
    if(res_dt.suc > 0 && res_dt.msg.length > 0){
        // console.log(res_dt.msg);
        for(let dt of res_dt.msg){
            var select = 'id, occu_name name, occu_id', 
                table_name = 'md_occupation',
                whr = `occu_id = ${dt.id}`,
                order = 'ORDER BY occu_name';
            var occu_dt = await db_Select(select, table_name, whr, order)
            new_arr[dt.catg_name] = occu_dt.suc > 0 ? occu_dt.msg : null
        }
        res_data = {suc: 1, msg: Buffer.from(JSON.stringify(new_arr), 'utf8').toString('base64')}
    }else{
        res_data = {suc: res_dt.suc, msg: Buffer.from(JSON.stringify(res_dt), 'utf8').toString('base64')}
    }
    res.send(res_data)
})

MasterRouter.get('/income_list', async (req, res) => {
    var data = req.query
    var select = 'id, income', 
        table_name = 'md_income',
        whr = data.id > 0 ? `id = ${id}` : null,
        order = null;
    var res_dt = await db_Select(select, table_name, whr, order)
    res.send({suc: 1, msg: Buffer.from(JSON.stringify(res_dt.msg), 'utf8').toString('base64')})
})

MasterRouter.get('/education', async (req,res) => {
    var data = req.query
    var new_arr = {}, res_data;
    var select = 'id, edu_catg',
     table_name = 'md_edu_catg',
    whr = data.id > 0 ? `id = ${id}` : null;
    order = 'ORDER BY edu_catg';
    var res_dt = await db_Select(select, table_name, whr, order)
    if(res_dt.suc > 0 && res_dt.msg.length > 0){
        // console.log(res_dt.msg);
        for(let dt of res_dt.msg){
            var select = 'id, edu_name name, edu_id', 
                table_name = 'md_education',
                whr = `edu_id = ${dt.id}`,
                order = 'ORDER BY edu_name';
            var edu_dt = await db_Select(select, table_name, whr, order)
            new_arr[dt.edu_catg] = edu_dt.suc > 0 ? edu_dt.msg : null
        }
        res_data = {suc: 1, msg: Buffer.from(JSON.stringify(new_arr), 'utf8').toString('base64')}
    }else{
        res_data = {suc: res_dt.suc, msg: Buffer.from(JSON.stringify(res_dt), 'utf8').toString('base64')}
    }
    res.send(res_data)
})

MasterRouter.get('/lang_list', async (req, res) => {
    var data = req.query
    var select = 'id, lang_name', 
        table_name = 'md_language',
        whr = data.id > 0 ? `id = ${id}` : null,
        order = null;
    var res_dt = await db_Select(select, table_name, whr, order)
    res.send({suc: 1, msg: Buffer.from(JSON.stringify(res_dt.msg), 'utf8').toString('base64')})
})

const getNakhatra = (degree = null, pos = null) => {
 return new Promise(async (resolve, reject) => {
    var select = 'a.id, a.from_deg, a.to_deg, b.nakhatra',
    table_name = 'md_pos_nakhatra a, md_nakhatra b'
    whr = `a.nakhatra_id = b. nakhatra_id AND a.from_deg<=${degree} AND a.to_deg>=${degree} AND a.pos=${pos};`,
    order = null;
    var res_dt = db_Select(select, table_name, whr, order)
    resolve(res_dt)
 })
}

module.exports = {MasterRouter,getNakhatra}
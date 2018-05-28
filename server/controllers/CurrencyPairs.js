const express = require("express");
const router = express.Router();

const db = require("../firebase.js").database();

const currencyPairRef = db.ref("CurrencyPairs");

currencyPairRef.once("value").then((snapshot)=>{
    if (!snapshot.exists()) {
        currencyPairRef.push("BTC"); //what happens if fail...
        currencyPairRef.push("ETH");
    }
});


router.get("/", (req, res)=>{
    currencyPairRef.once("value").then((snapshot)=>{
        let list = [];
        snapshot.forEach(child=>{
            list.push({id:child.key, val : child.val()});
        });
        res.send(list);
    });
})

router.post("/", (req, res)=>{
    let currency = req.body.currency;
    if (currency){
        currencyPairRef.push(currency).then((data)=>{
            res.send({id:data.key, val:currency});
        });
    }else{
        res.status(400).send("Must have a currency in body!");
    }
});

router.delete("/:pairid", (req, res)=>{
    db.ref("CurrencyPairs/"+req.params.pairid).remove()
        .then(()=>{
            res.send("removed");
        })
});

module.exports = router;

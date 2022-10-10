const User = require('../models/User');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const RefreshToken = require('../models/RefreshToken')
const bcrypt = require('bcrypt')

class UserController {
    refreshToken = [];

    get = (req, res) => {
        const users = User.find().then(data => {
            return res.send({
                success : true,
                data : data
            })
        }).catch(err => {
            res.status(201).send({
                success: false,
                message : err
            })
        })
    }

    register = async (req, res) => {
        const body = req.body;

        try {
            const pw = await bcrypt.hash(body.password, 10);

            const user = new User({
                name: body.name,
                email: body.email,
                password: pw //nanti cari tahu laravel gmna
            });

            let saved = user.save();

            res.send({
                success: true,
                message: 'user registered!',
                data: user
            });
        } catch (error) {
            res.status(401).send({
                success: false,
                message : error
            })
        }
        
    }

    login = async (req,res) => {
        try {
            const body = req.body;

            const user = User.findOne({
                email: body.email
            },async (err, data) => {
                if (err) {
                    res.status(401).send({
                        success: false,
                        message: 'user not found'
                    });
                }

                if (!data) {
                    res.status(401).send({
                        success: false,
                        message: 'user not found',
                        error: err
                    });
                }

                const pass = await bcrypt.compare(body.password, data.password)
                    if(pass) {

                    const payload = {
                        ...data
                    }
                    console.log({
                        payload
                    })
                    const token = this.verify(payload)
                    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN);
                    this.storeRefreshToken(refreshToken)

                    res.send({
                        success: true,
                        message: 'youre login',
                        data: data,
                        token: token,
                        refresh_token: refreshToken
                    })
                } else {
                    res.status(500).send({
                        success : false,
                        message : 'not allowed'
                    })
                }
            })
        } catch (error) {
            res.status(400).send({
                success : false,
                message : error
            })
        }
        
    }

    storeRefreshToken(token){
        const rt = new RefreshToken({
            token : token
        }).save();

        return rt;
    }

    verify(payload){
        return jwt.sign(payload, process.env.TOKEN , {expiresIn : '15s'})
    }

    refresh(req, res) {
        
    }
}

module.exports = new UserController()
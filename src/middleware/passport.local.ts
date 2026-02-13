import { prisma } from "config/client";

import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { getUserSumCart, getUserWithRoleById } from "service/client/auth.service";

import { comparePassword, getUserById } from "service/user.service";


const ConfigPassportLocal = () => {
    passport.use(new LocalStrategy({passReqToCallback: true},async function verify(req,username, password, callback) {

          const {session}=req as any;
          if(session?.messages?.length){
            session.messages=[];
          }
    


        // console.log(">>> check username , password", username, password);
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (!user) {

            return callback(null, false, { message: `ユーザー名 と パスワードが正しくありません` })
        }
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return callback(null, false, { message: 'ユーザー名 と パスワードが正しくありません' });

        }
        return callback(null, user as any);
        // db.get('SELECT * FROM users WHERE username = ?', [username], function (err, row) {
        //     if (err) { return cb(err); }
        //     if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

        //     crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
        //         if (err) { return cb(err); }
        //         if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
        //             return cb(null, false, { message: 'Incorrect username or password.' });
        //         }
        //         return cb(null, row);
        //     });
        // });
    }));

    passport.serializeUser(function (user:any, cb) {
       
            cb(null, { id: user.id, username: user.username });
        
    });

    passport.deserializeUser(async function (user :any, cb) {
       const {id , username } =user
       const userId :any= await getUserWithRoleById(id);
       const sumCart= await getUserSumCart(id)
    //    console.log(userId);
            return cb(null, {...userId,sumCart:sumCart});
             
    });

}





export default ConfigPassportLocal;


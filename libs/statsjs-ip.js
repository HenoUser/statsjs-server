"use strict";
const geoip     = require("geoip-lite"),
    mongo       = require("./mongodb");

/**
 * @description
 * SHA1 hashing IP function
 */
let sha1;
(function(x,F){"undefined"!=typeof module&&(x=global);var k="0123456789abcdef".split(""),C=[-2147483648,8388608,32768,128],v=[24,16,8,0],b=[],D=function(w){var x="string"!=typeof w;x&&w.constructor==ArrayBuffer&&(w=new Uint8Array(w));var n,p,q,r,t,m=0,y=!1,a,l,h,u=0,z=0,B=0,A=w.length;n=1732584193;p=4023233417;q=2562383102;r=271733878;t=3285377520;do{b[0]=m;b[16]=b[1]=b[2]=b[3]=b[4]=b[5]=b[6]=b[7]=b[8]=b[9]=b[10]=b[11]=b[12]=b[13]=b[14]=b[15]=0;if(x)for(a=z;u<A&&64>a;++u)b[a>>2]|=w[u]<<v[a++&3];else for(a= z;u<A&&64>a;++u)m=w.charCodeAt(u),128>m?b[a>>2]|=m<<v[a++&3]:(2048>m?b[a>>2]|=(192|m>>6)<<v[a++&3]:(55296>m||57344<=m?b[a>>2]|=(224|m>>12)<<v[a++&3]:(m=65536+((m&1023)<<10|w.charCodeAt(++u)&1023),b[a>>2]|=(240|m>>18)<<v[a++&3],b[a>>2]|=(128|m>>12&63)<<v[a++&3]),b[a>>2]|=(128|m>>6&63)<<v[a++&3]),b[a>>2]|=(128|m&63)<<v[a++&3]);B+=a-z;z=a-64;u==A&&(b[a>>2]|=C[a&3],++u);m=b[16];u>A&&56>a&&(b[15]=B<<3,y=!0);for(h=16;80>h;++h)a=b[h-3]^b[h-8]^b[h-14]^b[h-16],b[h]=a<<1|a>>>31;var c=n,d=p,e=q,f=r,g=t;for(h= 0;20>h;h+=5)l=d&e|~d&f,a=c<<5|c>>>27,g=a+l+g+1518500249+b[h]<<0,d=d<<30|d>>>2,l=c&d|~c&e,a=g<<5|g>>>27,f=a+l+f+1518500249+b[h+1]<<0,c=c<<30|c>>>2,l=g&c|~g&d,a=f<<5|f>>>27,e=a+l+e+1518500249+b[h+2]<<0,g=g<<30|g>>>2,l=f&g|~f&c,a=e<<5|e>>>27,d=a+l+d+1518500249+b[h+3]<<0,f=f<<30|f>>>2,l=e&f|~e&g,a=d<<5|d>>>27,c=a+l+c+1518500249+b[h+4]<<0,e=e<<30|e>>>2;for(;40>h;h+=5)l=d^e^f,a=c<<5|c>>>27,g=a+l+g+1859775393+b[h]<<0,d=d<<30|d>>>2,l=c^d^e,a=g<<5|g>>>27,f=a+l+f+1859775393+b[h+1]<<0,c=c<<30|c>>>2,l=g^c^d,
    a=f<<5|f>>>27,e=a+l+e+1859775393+b[h+2]<<0,g=g<<30|g>>>2,l=f^g^c,a=e<<5|e>>>27,d=a+l+d+1859775393+b[h+3]<<0,f=f<<30|f>>>2,l=e^f^g,a=d<<5|d>>>27,c=a+l+c+1859775393+b[h+4]<<0,e=e<<30|e>>>2;for(;60>h;h+=5)l=d&e|d&f|e&f,a=c<<5|c>>>27,g=a+l+g-1894007588+b[h]<<0,d=d<<30|d>>>2,l=c&d|c&e|d&e,a=g<<5|g>>>27,f=a+l+f-1894007588+b[h+1]<<0,c=c<<30|c>>>2,l=g&c|g&d|c&d,a=f<<5|f>>>27,e=a+l+e-1894007588+b[h+2]<<0,g=g<<30|g>>>2,l=f&g|f&c|g&c,a=e<<5|e>>>27,d=a+l+d-1894007588+b[h+3]<<0,f=f<<30|f>>>2,l=e&f|e&g|f&g,a=d<<
    5|d>>>27,c=a+l+c-1894007588+b[h+4]<<0,e=e<<30|e>>>2;for(;80>h;h+=5)l=d^e^f,a=c<<5|c>>>27,g=a+l+g-899497514+b[h]<<0,d=d<<30|d>>>2,l=c^d^e,a=g<<5|g>>>27,f=a+l+f-899497514+b[h+1]<<0,c=c<<30|c>>>2,l=g^c^d,a=f<<5|f>>>27,e=a+l+e-899497514+b[h+2]<<0,g=g<<30|g>>>2,l=f^g^c,a=e<<5|e>>>27,d=a+l+d-899497514+b[h+3]<<0,f=f<<30|f>>>2,l=e^f^g,a=d<<5|d>>>27,c=a+l+c-899497514+b[h+4]<<0,e=e<<30|e>>>2;n=n+c<<0;p=p+d<<0;q=q+e<<0;r=r+f<<0;t=t+g<<0}while(!y);return k[n>>28&15]+k[n>>24&15]+k[n>>20&15]+k[n>>16&15]+k[n>>12&
    15]+k[n>>8&15]+k[n>>4&15]+k[n&15]+k[p>>28&15]+k[p>>24&15]+k[p>>20&15]+k[p>>16&15]+k[p>>12&15]+k[p>>8&15]+k[p>>4&15]+k[p&15]+k[q>>28&15]+k[q>>24&15]+k[q>>20&15]+k[q>>16&15]+k[q>>12&15]+k[q>>8&15]+k[q>>4&15]+k[q&15]+k[r>>28&15]+k[r>>24&15]+k[r>>20&15]+k[r>>16&15]+k[r>>12&15]+k[r>>8&15]+k[r>>4&15]+k[r&15]+k[t>>28&15]+k[t>>24&15]+k[t>>20&15]+k[t>>16&15]+k[t>>12&15]+k[t>>8&15]+k[t>>4&15]+k[t&15]};if(x.JS_SHA1_TEST||"undefined"==typeof module)x&&(x.sha1=D);else{var y=require("crypto"),E=require("buffer").Buffer;
    sha1=function(b){if("string"==typeof b)return y.createHash("sha1").update(b,"utf8").digest("hex");b.constructor==ArrayBuffer&&(b=new Uint8Array(b));return y.createHash("sha1").update(new E(b)).digest("hex")}}})(this);


module.exports = {
    save : (ip, call) => {
        const geo = geoip.lookup(ip) || "not supported",
            hash = sha1(ip);
        mongo.insert("stats", (err, result) => {
            if (err) return call(err);
            call(null, result[0]._id);
        }, [{ location : geo, networkID : hash }]);
    }
};
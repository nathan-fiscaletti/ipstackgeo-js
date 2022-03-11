const https = require(`https`);
const http = require(`http`);

const HOSTNAME = 'api.ipstack.com';

function _ips(...ips) {
    this._ips = ips;
    return this;
}

function _setKey(apiAccessKey) {
    this._apiAccessKey = apiAccessKey;
    return this;
}

function _perform(resolve, reject) {
    const searchParams = new URLSearchParams({
        access_key: this._apiAccessKey,
        output: 'json',
        hostname: this._lookupHostname ? 1 : 0,
        security: this._assessSecurity ? 1 : 0,
        language: this._language
    });

    const path = this._ips.length == 0 ? 'check' : this._ips.join(',');
    const proto = this._https ? 'https' : 'http';
    const query = searchParams.toString();
    const jsonp = this._jsonp ? `&callback=${this._jsonp}` : '';

    const reqUrl = `${proto}://${HOSTNAME}/${path}?${query}${jsonp}`;
    

    ((this._https) ? https : http).get(reqUrl, {timeout: this._timeout}, res => {
        if (res.statusCode !== 200) {
            reject(new Error(`${res.statusCode} ${res.statusMessage}`));
            return;
        }

        let data = '';
        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            if (this._jsonp) {
                resolve(data);
                return;
            }

            let jsonData;
            try {
                jsonData = JSON.parse(data);
            } catch (err) {
                reject(err);
                return;
            }

            if (jsonData.error) {
                reject(new Error(jsonData.error.info));
                return;
            }

            resolve(jsonData);
        });
    }).on('error', (err) => {
        reject(err);
    });
}

class GeoLookup extends Promise {
    _apiAccessKey; 
    _ips = [];
    _https = false;
    _lookupHostname = false;
    _assessSecurity = false; 
    _jsonp = undefined; 
    _language = 'en';
    _timeout = 10000;

    constructor() {
        super((resolve, reject) => {
            setTimeout(() => {
                _perform.call(this, resolve, reject);
            }, 0);
        });
    }

    useHttps() {
        this._https = true;
        return this;
    }

    lookupHostname() {
        this._lookupHostname = true;
        return this;
    }

    assessSecurity() {
        this._assessSecurity = true;
        return this;
    }

    language(val) {
        this._language = val;
        return this;
    }

    jsonp(functionName) {
        this._jsonp = functionName;
        return this;
    }

    timeout(ms) {
        this._timeout = ms;
        return this;
    }

    static get [Symbol.species]() {
        return Promise;
    }

    get [Symbol.toStringTag]() {
        return 'MyPromise';
    }
}

module.exports = (apiAccessKey) => {
    return {
        forIps: function (...ips) {
            return _ips.call(this.forSelf(), ips);
        },
        forSelf: function () {
            return _setKey.call(new GeoLookup(), apiAccessKey);
        }
    };
}
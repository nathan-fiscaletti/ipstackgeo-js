const https = require(`https`);
const http = require(`http`);

const HOSTNAME = 'api.ipstack.com';

class GeoLookup {
    #apiAccessKey; #ips; #https; #lookupHostname;
    #assessSecurity; #jsonp; #language; #timeout;

    constructor(apiAccessKey, ...ips) {
        this.#apiAccessKey = apiAccessKey;
        this.#ips = ips;

        this.#https = false;
        this.#lookupHostname = false;
        this.#assessSecurity = false;
        this.#jsonp = undefined;
        this.#language = 'en';
        this.#timeout = 10000;
    }

    useHttps() {
        this.#https = true;
        return this;
    }

    lookupHostname() {
        this.#lookupHostname = true;
        return this;
    }

    assessSecurity() {
        this.#assessSecurity = true;
        return this;
    }

    language(val) {
        this.#language = val;
        return this;
    }

    jsonp(functionName) {
        this.#jsonp = functionName;
        return this;
    }

    timeout(ms) {
        this.#timeout = ms;
        return this;
    }

    get(success, error) {
        return new Promise((resolve, reject) => {
            const searchParams = new URLSearchParams({
                access_key: this.#apiAccessKey,
                output: 'json',
                hostname: this.#lookupHostname ? 1 : 0,
                security: this.#assessSecurity ? 1 : 0,
                language: this.#language
            });

            const path = this.#ips.length == 0 ? 'check' : this.#ips.join(',');
            const proto = this.#https ? 'https' : 'http';
            const query = searchParams.toString();
            const jsonp = this.#jsonp ? `&callback=${this.#jsonp}` : '';

            const reqUrl = `${proto}://${HOSTNAME}/${path}?${query}${jsonp}`;
            

            ((this.#https) ? https : http).get(reqUrl, {timeout: this.#timeout}, res => {
                if (res.statusCode !== 200) {
                    reject(new Error(`${res.statusCode} ${res.statusMessage}`));
                    return;
                }

                let data = '';
                res.on('data', chunk => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (this.#jsonp) {
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
        }).then(success, error);
    }
}

module.exports = (apiAccessKey) => {
    return {
        forIps: (...ips) => {
            return new GeoLookup(apiAccessKey, ...ips);
        },
        forSelf: () => {
            return new GeoLookup(apiAccessKey);
        }
    };
}
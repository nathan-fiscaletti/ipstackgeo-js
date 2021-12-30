# IPStack for Node.JS (Geo Location Library)
> **IPStack for Node.JS** is a simple library used to interface with an IPStack Geo API.

```
$ npm i ipstackgeo-js
```

[![Downloads](https://img.shields.io/npm/dw/ipstackgeo-js)](https://www.npmjs.com/package/ipstackgeo-js)
[![GitHub stars](https://img.shields.io/github/stars/nathan-fiscaletti/ipstackgeo-js)](https://github.com/nathan-fiscaletti/ipstackgeo-js/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/nathan-fiscaletti/ipstackgeo-js)](https://github.com/nathan-fiscaletti/ipstackgeo-js/issues)
[![GitHub license](https://img.shields.io/github/license/nathan-fiscaletti/ipstackgeo-js)](https://github.com/nathan-fiscaletti/ipstackgeo-js/blob/main/LICENSE)

Learn more about IPStack here: [ipstack.net](https://ipstack.com/product)

[Looking for the Python version?](https://github.com/nathan-fiscaletti/ipstackgeo-py)

[Looking for the PHP version?](https://github.com/nathan-fiscaletti/ipstackgeo-php)

### Features
* Retrieve the Geo Location data for any IP address.
* Retrieve the Geo Location data for the system executing this code.
* Retrieve the Geo Location data for a client.
* Retrieve the Geo Location data for a batch of IP addresses.
* Assess the security of an IP address.

---

### Basic Usage

```js
const geoLookup = require(`ipstackgeo-js`)('<YOUR-API-KEY>');

geoLookup.forSelf().get(
    res => console.log(res),
    err => console.log(err)
);
```

### Example Usage

> Note: See [IPStack: Response Objects](https://ipstack.com/documentation#objects) for a list of available properties in a response object.

#### Create the GeoLookup Object

```js
const geoLookup = require(`ipstackgeo-js`)('<YOUR-API-KEY>');
```

#### Lookup a location for an IP Address

```js
// Retrieve the location information for 
// github.com by using it's hostname.
// 
// This function will work with hostnames
// or IP addresses.
geoLookup.forIps('github.com')
    .get(
        (res) => console.log(res),
        (err) => console.log(err)
    );
```

#### Look up own location
```js
geoLookup.forSelf().get(
    (res) => console.log(res),
    (err) => console.log(err)
);
```

#### Other Features

There are also a few other useful features built into this library and the IPStack API.

1. Bulk Location Lookup

   The ipstack API also offers the ability to request data for multiple IPv4 or IPv6 addresses at the same time. This requires the PROFESSIONAL teir API key or higher and is limitted to 50 IPs at a time.
   > See: [https://ipstack.com/documentation#bulk](https://ipstack.com/documentation#bulk)

   ```js
   const ips = ['google.com', 'github.com', '1.1.1.1'];
   geoLookup.forIps(...ips).get(
       (res) => console.log(res),
       (err) => console.log(err)
   );
   ```

2. Requesting the hostname for an IP address.

   By default, the ipstack API does not return information about the hostname the given IP address resolves to. In order to include the hostname use the following.
   > See: [https://ipstack.com/documentation#hostname](https://ipstack.com/documentation#hostname)

   ```js
   geoLookup.forIps('1.1.1.1')
       .lookupHostname()
       .get(
           (res) => console.log(res.hostname),
           (err) => console.log(err)
       );
   ```

   Output:
   ```
   one.one.one.one
   ```

3. Assessing Security

   Customers subscribed to the Professional Plus Plan may access the ipstack API's Security Module, which can be used to assess risks and threats originating from certain IP addresses before any harm can be done to a website or web application.
   > See: [https://ipstack.com/documentation#security](https://ipstack.com/documentation#security)

   ```js
   geoLookup.forIps('1.1.1.1')
       .assessSecurity()
       .get(
           (res) => console.log(res),
           (err) => console.log(err)
       );
   ```

4. Set the language for a response

   The ipstack API is capable of delivering its result set in different languages. To request data in a language other than English (default) use following with one of the supported language codes.
   > See: [https://ipstack.com/documentation#language](https://ipstack.com/documentation#language)

   [Supported Langauges](https://ipstack.com/documentation#language)

   ```js
   geoLookup.forSelf()
       .language('en')
       .get(
           (res) => console.log(res),
           (err) => console.log(err)
       );
   ```

5. Configuring your request

   ```js
   geoLookup.forSelf()
       /// Use HTTPS. Note: This requires IPStack Basic plan or higher.
       .useHttps()
       /// Configure the timeout for requests
       .timeout(15000)
       .get(
           (res) => console.log(res),
           (err) => console.log(err)
       );
   ```

6. Using JSONP Callbacks

   The ipstack API supports JSONP Callbacks, enabling you to enter a function name and cause the API to return your requested API result wrapped inside that function.
   > See: [https://ipstack.com/documentation#jsonp](https://ipstack.com/documentation#jsonp)

   ```js
   geoLookup.forIp()
       .jsonp('someSpecialFunctionName')
       .get(
           // When using jsonp(), res will be a string instead of an object.
           (res) => console.log(res),
           (err) => console.log(err)
       );
   ```

   Output:
   ```
   someSpecialFunctionName({ ... });
   ```

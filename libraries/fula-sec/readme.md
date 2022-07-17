<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
*** Nice Template: https://github.com/othneildrew/Best-README-Template
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<div align="center">


<h3 align="center">Fula Security Layer (FSL)</h3>

  <p align="center">
    Fula Security Layer Includes Data Authentication, Decentralized Identity and Encryption.
    <br />
  </p>
</div>

#
Fula-sec providing two different way encryption methods.
1. Tagged Encryption.(Tagged DID) 
2. Asymmetric Encryption. 

## Installation


Install NPM package
   ```sh
   npm install @functionland/fula-sec --save
   ```
<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Decentralized Identity (DID) 
   ```js
    import {FulaDID} from '@functionland/fula-sec'

    // Fulla DID
    const fulaDID = new FulaDID();
    // Create DID identity (_secretKey, signature) => return {did|authDID, mnemonic, privateKey}
    await fulaDID.create(secretKey, signature);
   ```
<p align="right">(<a href="#top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Tagged Encryption (Tagged DID) 
   ```js
    import {FulaDID, TaggedEncryption} from '@functionland/fula-sec'

    // Alice creates own DID 
    const AliceDID = new FulaDID();
    await AliceDID.create(secretKey, signature);
    const taggedA = new TaggedEncryption(AliceDID.did);

    // Bob creates own DID
    const BobDID = new FulaDID();
    await BobDID.create(secretKey, signature);
    const taggedB = new TaggedEncryption(BobDID.did);

    // 1. Handshake             |Alice DID| <---  |Bob DID|      
    // 2. Share Content         |Encrypt  | jwe-> |Decrypt| 
    
    // Alice is issuer and she want to share content with Bob (Audience)
    let plaintext = {
            symetricKey: 'content-privateKey',
            CID: 'Content ID'
        }
    // Alice encrypts the content by adding Bob's DID id () => return jwe {}
    let jwe = await taggedA.encrypt(plaintext.symetricKey, plaintext.CID, [BobDID.did.id])

    // Bob decrypts to get the content allowed by Alice.
    let dec = await taggedB.decrypt(jwe) 
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->
## Asymmetric Encryption 
   ```js
    import {FulaDID, AsymEncryption} from '@functionland/fula-sec'

     // Alice creates own DID (Issuer)
    const AliceDID = new FulaDID();
    await AliceDID.create(secretKey, signature);
    // Set privateKey
    const asymEncA = new AsymEncryption(AliceDID.privateKey);

     // Bob creates own DID (Audience)
    const BobDID = new FulaDID();
    await BobDID.create(secretKey, signature);
    // Set privateKey
    const asymEncB = new AsymEncryption(BobDID.privateKey);

    /* 
       1. Bob shares PublicKey with Alice
       2. Encrypt content with Bob`s PubKey and Decrypt JWE with Bob`s 
                                                      |      Alice            |       |       Bob        |  
                                                      |publicKey=(DID^pk)     | <---  |publicKey=(DID^pk)|      
                                                      |jwe=Enc(m, Bob^PubKey) | jwe-> |Dec(cip, Bob^pk)  |                                                          
    */

    // Alice is issuer and she want to share content with Bob (Audience)
    let plaintext = {
            symetricKey: 'content-privateKey',
            CID: 'Content ID'
        }

    // Issuer (Alice) encrypts plaintext with Audience (Bob) PublicKey
    let jweCipher = await asymEncA.encrypt(plaintext.symetricKey, plaintext.CID, [asymEncB.publicKey]);

    // Audience (Bob) decrypts with own private Key
    let decrypted = await asymEncB.decrypt(jweCipher);

   ```

<p align="right">(<a href="#top">back to top</a>)</p>


## Document Page
Run doc cmd 
    
    npx typedoc --out docs

[Fulla Sec DOC](http://127.0.0.1:5500/libraries/fula-sec/docs/classes/FulaDID.html)




<!-- ROADMAP -->
## Roadmap
- [X] Identity (DIDs)
- [X] Encryption
- [ ] Authentication


See the [open issues](https://github.com/functionland/fula/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>

## Development
- You have the opportunity to test it by installing a [demo application -> ](https://github.com/functionland/photos)
- Learn how to implement the Fula protocol and integrate protocols to your own app. [Get Started -> ](https://github.com/functionland/fula)
- Fula documents related to Architecture, Protocol, dApps and  and usage can be found on the [Function land documentation site](https://functionland.gitbook.io/product-docs/EZsKoqxFAOfV4Ap7jQjB/)


<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>


## Community
- Connect with function land developers. Questions, support, and discussions: [Join the Fx Discord](https://discord.com/invite/k9UybUBdBB)
- Bugs and Feature Requests: Open an issue in the appropriate [Github repository](https://github.com/functionland)
- The latest updates can be found here. [Blog](https://blog.fx.land/), [twitter](https://twitter.com/functionland)


## Maintainers
- [Saidov](https://github.com/ruffiano89)

<!-- LICENSE -->
## License

See [`LICENSE`](/LICENSE) for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

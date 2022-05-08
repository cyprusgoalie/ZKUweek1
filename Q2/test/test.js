const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");
const { groth16 } = require("snarkjs");
const { plonk } = require("snarkjs");

function unstringifyBigInts(o) {
    if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
        return BigInt(o);
    } else if ((typeof(o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o) ))  {
        return BigInt(o);
    } else if (Array.isArray(o)) {
        return o.map(unstringifyBigInts);
    } else if (typeof o == "object") {
        if (o===null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach( (k) => {
            res[k] = unstringifyBigInts(o[k]);
        });
        return res;
    } else {
        return o;
    }
}

describe("HelloWorld", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("HelloWorldVerifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        
        // generates a zero-knowledge proof using groth16 by taking the input signals,
        // the .wasm binary generated from the circuit, and the .zkey from the circuit.
        // the output is the proof and the public signals
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2"}, "contracts/circuits/HelloWorld/HelloWorld_js/HelloWorld.wasm","contracts/circuits/HelloWorld/circuit_final.zkey");

	// writing to the console, showing the multiplication that will be proved
        console.log('1x2 =',publicSignals[0]);
	
	// the proof and public signals are output by groth16 as strings.
	// here we "uncast" these strings to make the usable (or unstringify them)
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        
        // getting the Solidity calldata from groth16, given the proof and public signals
        // in Solidity, calldata specifies the location of function arguments
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
    	// the calldata above is an array with values given in hexadecimal format (aka hex)
    	// but we want these values as integers. So we split up the array and convert (or map)
    	// the hex values to their integer quivalent. This is saved as an array of strings.
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
	//console.log(argv);
	
	// splitting up the newly generated array of integer values into a, b, c, and Input
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);
        //console.log(a);
        //console.log(b);
        //console.log(c);
        //console.log(Input);
	
	
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with Groth16", function () {
   let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("Multiplier3Verifier");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        
        // generates a zero-knowledge proof using groth16 by taking the input signals,
        // the .wasm binary generated from the circuit, and the .zkey from the circuit.
        // the output is the proof and the public signals
        const { proof, publicSignals } = await groth16.fullProve({"a":"1","b":"2","c":"3"}, "contracts/circuits/Multiplier3/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3/circuit_final.zkey");

	// writing to the console, showing the multiplication that will be proved
        console.log('1x2x3 =',publicSignals[0]);
	
	// the proof and public signals are output by groth16 as strings.
	// here we "uncast" these strings to make the usable (or unstringify them)
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        
        // getting the Solidity calldata from groth16, given the proof and public signals
        // in Solidity, calldata specifies the location of function arguments
        const calldata = await groth16.exportSolidityCallData(editedProof, editedPublicSignals);
    
    	// the calldata above is an array with values given in hexadecimal format (aka hex)
    	// but we want these values as integers. So we split up the array and convert (or map)
    	// the hex values to their integer quivalent. This is saved as an array of strings.
        const argv = calldata.replace(/["[\]\s]/g, "").split(',').map(x => BigInt(x).toString());
        // console logging to debug the code
	// console.log(argv);
	
	// splitting up the newly generated array of integer values into a, b, c, and Input
        const a = [argv[0], argv[1]];
        const b = [[argv[2], argv[3]], [argv[4], argv[5]]];
        const c = [argv[6], argv[7]];
        const Input = argv.slice(8);
        // console logging to debug the code
        //console.log(a);
        //console.log(b);
        //console.log(c);
        //console.log(Input);

	// verifying a valid proof and giving the proof time
        expect(await verifier.verifyProof(a, b, c, Input)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
        // defining a parameter set which will give an invalid proof
        let a = [0, 0];
        let b = [[0, 0], [0, 0]];
        let c = [0, 0];
        let d = [0]
        // verifying an invalid proof and giving the proof time
        expect(await verifier.verifyProof(a, b, c, d)).to.be.false;
    });
});


describe("Multiplier3 with PLONK", function () {
    let Verifier;
    let verifier;

    beforeEach(async function () {
        Verifier = await ethers.getContractFactory("Multiplier3Verifier_plonk");
        verifier = await Verifier.deploy();
        await verifier.deployed();
    });

    it("Should return true for correct proof", async function () {
        //[assignment] Add comments to explain what each line is doing
        
        // generates a zero-knowledge proof using plonk by taking the input signals,
        // the .wasm binary generated from the circuit, and the .zkey from the circuit.
        // the output is the proof and the public signals
        const { proof, publicSignals } = await plonk.fullProve({"a":"1","b":"2","c":"3"}, "contracts/circuits/Multiplier3_plonk/Multiplier3_js/Multiplier3.wasm","contracts/circuits/Multiplier3_plonk/circuit_final.zkey");

	// writing to the console, showing the multiplication that will be proved
        console.log('1x2x1 =',publicSignals[0]);
	
	// the proof and public signals are output by plonk as strings.
	// here we "uncast" these strings to make the usable (or unstringify them)
        const editedPublicSignals = unstringifyBigInts(publicSignals);
        const editedProof = unstringifyBigInts(proof);
        
        // getting the Solidity calldata from plonk, given the proof and public signals
        // in Solidity, calldata specifies the location of function arguments
        const calldata = await plonk.exportSolidityCallData(editedProof, editedPublicSignals);
    	// console.log(calldata);
    	// the calldata above is an array with values given in hexadecimal format (aka hex)
    	// but we want *some* of these values as integers. So we split up the array.
    	// for plonk, our proof input needs to be of type "byte" meaning we want the hex format
    	// our value input needs to be an integer, so we have to map that like we did in the groth16 version
        const argv = calldata.replace(/["[\]\s]/g, "").split(',');

	// getting the hex byte value for the proof
        const a = argv[0];
        // getting the public signal value as an int, which we need to cast from its current hex form
        const b = argv.map(x => BigInt(x).toString()).splice(1);

        //console.log(a);
        //console.log(b);
	
	// verifying a valid proof and giving the proof time
        expect(await verifier.verifyProof(a,b)).to.be.true;
    });
    it("Should return false for invalid proof", async function () {
    	// defining a parameter set which will give an invalid proof
        let a = "0x";
        //console.log(a);
        let b = [0];
        //console.log(b);
        // verifying an invalid proof and giving the proof time
        expect(await verifier.verifyProof(a, b)).to.be.false;
    });
});

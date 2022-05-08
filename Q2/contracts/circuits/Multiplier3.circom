pragma circom 2.0.0;

// [assignment] Modify the circuit below to perform a multiplication of three signals

// re-writing our implementation of Multiplier2(), which sets an output signal, d, as the product of
// two input signals, a and b. 
template Multiplier2() {
   // Declaration of signals.  
   signal input a;  
   signal input b;
   signal output d;

   // Constraints.  
   d <== a * b;  
}

// this code multiplies 3 input values together, and sets the output signal as their product.
// since circom cannot handle non-quadratic constraints, we need to use the Multiplier2() circuit
// to multiply two of our signals for us, then use their output.
template Multiplier3 () {  

   // Declaration of signals.  
   signal input a;  
   signal input b;
   signal input c;
   signal output d;  
   
   // defining a Multiplier2() circuit to use for our first 2 input signals
   component m1 = Multiplier2();
   
   // inputing our input signals
   m1.a <== a;
   m1.b <== b;
   
   // calculating the output as the product of the Mutiplier2() with the first two inputs,
   // and the third input
   d <== m1.d * c;
   
   // NOTE: Alternative code below
   // Below I show an alternative circuit structure with the same underlying logic,
   // but using 2 different Multiplier2() circuits. The final output is the same,
   // and compiles, but is probably less efficient (and certainly less compactly written)
   // than the above implementation
   
   // defining two Multiplier2() circuits to use
   // component m1 = Multiplier2();
   // component m2 = Multiplier2();
    
   // inputing our first two input signals
   // m1.a <== a;
   // m1.b <== b;
   
   // inputing into the second circuit the output of our first circuit (i1 * i2)
   // m2.a <== m1.d;
   
   // second input for our second circuit
   // m2.b <== c;
   
   // output of (i1 * i2) * i3
   // d <== m2.d;
}

component main = Multiplier3();

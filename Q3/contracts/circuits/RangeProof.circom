pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template RangeProof(n) {
    assert(n <= 252);
    signal input in; // this is the number to be proved inside the range
    signal input range[2]; // the two elements should be the range, i.e. [lower bound, upper bound]
    signal output out;

    component low = LessEqThan(n);
    component high = GreaterEqThan(n);

    // [assignment] insert your code here
    
    // setting up the less than checker with the upper bound
    low.in[0] <== range[1];
    low.in[1] <== in;
    
    // setting up the greater than checker with the upper bound
    high.in[0] <== range[0];
    high.in[1] <== in;
    
    // returning the logical AND of the outputs of both, which is a boolean
    out <== low.out && high.out;
}

component main = RangeProof(n);

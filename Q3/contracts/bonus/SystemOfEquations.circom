pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";
//include ""; // hint: you can use more than one templates in circomlib-matrix to help you

template SystemOfEquations(n) { // n is the number of variables in the system of equations
    signal input x[n]; // this is the solution to the system of equations
    signal input A[n][n]; // this is the coefficient matrix
    signal input b[n]; // this are the constants in the system of equations
    signal output out; // 1 for correct solution, 0 for incorrect solution

    // [bonus] insert your code here
    
    // we begin by assuming that all lines are valid (i.e. we will return 1)
    // if at any point one of the lines is invalid, we change this to return 0
    var validLines = 1;
    
    // initializing an array for isEqual circuit comparators
    component iseq[n];
    
    // iterating through the rows of the matrix (aka system of linear equations)
    for(var i = 0; i < n; i++)
    {
    	// setting the first comparison value to the constant value for this row
        iseq[i] = IsEqual();
        iseq[i].in[0] <== b[i];
        
        // logging for debugging
        // log(b[i]);
        
        // initializing our row summation variable
        var sum = 0;
        
        // iterating through the column of the matrix and summing all of the values
        // in the row by multiplying the matrix coefficient by the corresponding solution value
        // here we assume that the coefficient matrix and solution array are in the order
        // of x, y, z.
    	for(var j = 0; j < n; j++)
    	{
    	    // adding to the row summation by multiplying the x (or y, z) solution with the coefficient
            sum += (x[j] * A[i][j]);
    	}
    	// setting the second value of the comparitor circuit as the row summation
        iseq[i].in[1] <-- sum;  
        // logging for debugging
        log(sum);
              
	// if the two values in the isEqual circuit are equal, we multiply validLines by 1
	// otherwise, we multiply by 0
        validLines *= iseq[i].out==1? 1 : 0;
        // logging for debugging
        log(validLines);
    }
    // setting the output of the circuit as our validLines value
    out <-- validLines;
}

component main {public [A, b]} = SystemOfEquations(3);

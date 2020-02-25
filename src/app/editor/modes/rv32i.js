(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
      mod(require("codemirror/lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
      define(["codemirror/lib/codemirror"], mod);
    else // Plain browser env
      mod(CodeMirror);
  })(function(CodeMirror) {
    "use strict";
  
    // Elenco delle istruzioni del RISC-V R32I
    const instructions_R = 'ADD|SUB|SLL|SLT|SLTU|XOR|SRL|SRA|OR|AND';
    const instructions_I = 'ADDI|SLTI|SLTIU|XORI|ORI|ANDI|SLLI|SRLI|SRAI|LB|LH|LW|LBU|LHU';
    const instructions_IJ = 'JALR';
    const instructions_S = 'SB|SH|SW';
    const instructions_B = 'BEQ|BNE|BLT|BGE|BLTU|BGEU';
    const instructions_U = 'LUI|AUIPC';
    const instructions_J = 'JAL';
  
    CodeMirror.defineMode('rv32i', function(){
      return {
        startState: function(){
          return { first: true, j_instruction: false };
        },
        token: function(stream, state){
          let style;
  
          if (stream.sol()) {
            state.first = true;
            state.j_instruction = false;
          }
  
          if (stream.match(/^;.*/)) {
            style = 'comment'
          } else if (stream.match(/^\w+:/)) {
            style = 'tag'
          } else if (stream.match(RegExp('^('+instructions_J+')', 'i'))) {
            style = 'keyword-j';
            state.j_instruction = true;
          } else if (stream.match(RegExp('^('+instructions_IJ+')', 'i'))) {
            style = 'keyword-j';
            state.j_instruction = true;
          } else if (stream.match(RegExp('^('+instructions_I+')', 'i'))) {
            style = 'keyword-i';
          } else if (stream.match(RegExp('^('+instructions_R+')', 'i'))) {
            style = 'keyword-r';
          } else if (stream.match(RegExp('^('+instructions_S+')', 'i'))) {
            style = 'keyword-s';
          } else if (stream.match(RegExp('^('+instructions_U+')', 'i'))) {
            style = 'keyword-u';
          } else if (stream.match(RegExp('^('+instructions_B+')', 'i'))) {
            style = 'keyword-b';
          } else if (stream.match(/^R[123]?\d/i)) {
            style = 'variable';
            if (state.first) {
              style += '-2';
              state.first = false;
            }
          } else if (stream.match(/^0x([0-9A-F]{4})/i)) {
            style = 'number';
          } else if (state.j_instruction && stream.match(/^\w+/)) {
            style = 'tag';
            state.j_instruction = false;
          } else {
            stream.next();
          }
  
          return style;
        },
        indent: function(state){
        }
      };
    });
  });
  
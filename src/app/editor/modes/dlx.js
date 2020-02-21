(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("codemirror/lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["codemirror/lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
  "use strict";

  /** elenco istruzioni diviso per tipo, register, immediate e jump
    * IJ sarebbero le istruzioni di tipo immediate che però si comportano come jump
  */
  const instructions_R = 'ADDU|ADD|AND|DIV|MOVI2S|MOVS2I|MULT|NOP|OR|SEQ|SGE|SGT|SLE|SLL|SLT|SNE|SRA|SRL|SUBU|SUB|XOR';
  const instructions_I = 'ADDI|ADDUI|ANDI|DIVI|LBU|LB|LHI|LHU|LH|LW|MULTI|ORI|SB|SEQI|SGEI|SGTI|SH|SLEI|SLLI|SLTI|SNEI|SRAI|SRLI|SUBI|SUBUI|SW|XORI';
  const instructions_IJ = 'BEQZ|BNEZ|JALR|JR';
  const instructions_J = 'JAL|J|RFE|TRAP';

  CodeMirror.defineMode('dlx', function(){
    return {
      startState: function(){
        return { first: true, j_instruction: false, indent: 0};
      },
      token: function(stream, state){
        let style;
        let matched;

        if (stream.sol()) {
          state.first = true;
          state.j_instruction = false;
        }

        if (stream.match(/^;.*/)) {
          style = 'comment';
        } else if (matched = stream.match(/^\w+:/)) {
          style = 'tag';
          state.indent = matched[0].length + 1;
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
        return state.indent;
      }
    };
  });
});

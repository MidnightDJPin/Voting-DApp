App = {
  web3Provider: null,
  Voting: null,

  //程序初始化
  init: function() {
    return App.initWeb3();
  },

  //初始化web3
  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545")
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  //初始化合约
  initContract: function() {
    $.getJSON('Voting.json', function (data) {
        App.Voting = TruffleContract(data);
        App.Voting.setProvider(App.web3Provider);
        return App.initData();
    });
    $("#vote").on("click", App.voteForCandidate);
  },

  //界面初始化
  initData: function() {
    let candidates = {"1": "candidate-1", "2": "candidate-2"}
    let candidateNames = Object.keys(candidates);
    for (var i = 0; i < candidateNames.length; i++) {
      let name = parseInt(candidateNames[i]);

      App.Voting.deployed().then(function(contractInstance) {
          return contractInstance.totalVotesFor(name);
        }).then(function(v) {
          console.log(v);
          $("#" + candidates[name]).html(v.toString());
        }).catch(function(err) {
          console.log(err.message);
        });
      }
    },

    //投票事件
    voteForCandidate: function() {
      let candidateNum = $("#candidate").val();
      let ethvalue = $("#value").val();
      let weivalue = web3.toWei(ethvalue, 'ether');
      App.Voting.deployed().then(function(contractInstance) {
        return contractInstance.voteForCandidate(candidateNum, {value: weivalue});
      }).then(function(v) {
        App.initData();
      }).catch(function(err) {
        console.log(err.message);

      });
    }

};


  $(function() {
    $(window).load(function() {
      App.init();
    });
  });

factories.factory('accessFactory', function() {
  var accessToken;
  var member;

  var changeAccessToken = function(token)  {
    accessToken = token;
  };

  var getAccessToken = function() {
    return accessToken;
  };

  var setMemberInfo = function(memberObject) {
    member = memberObject;
  };

  var getMemberInfo = function() {
    return member;
  };

  return {
    changeAccessToken: changeAccessToken,
    getAccessToken: getAccessToken,
    setMemberInfo: setMemberInfo,
    getMemberInfo: getMemberInfo,
  };
});

factories.factory('SessionFactory', function() {
  return {
    add: function(name, value) {
      window.localStorage.setItem(name, value);
    },
    remove: function(name) {
      window.localStorage.removeItem(name);
    },
    exists: function(name) {
      if (window.localStorage[name]) {
        return true;
      }
      return false;
    },
  };
});

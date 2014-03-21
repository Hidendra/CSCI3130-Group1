beforeEach(function() {
    watchLocation = jasmine.createSpy("watchLocation");    
	clearLocation = jasmine.createSpy("clearLocation");
});

describe("Verify GPS toggler", function() {
	beforeEach(function() {
	completeLogin( { key: 'asd21414ead' } );
	});

	it('tries to watch position', function (){
        $("#gpsToggle").trigger('click');
        expect(watchLocation).toHaveBeenCalled();
    });
	
	it('tries to clear position', function (){
        $("#gpsToggle").trigger('click');
        expect(clearLocation).toHaveBeenCalled();
    });

});

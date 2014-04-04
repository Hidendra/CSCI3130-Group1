describe("My Places", function() {
	it('can open my places', function (){
		var oldMethod = myPlace;
		myPlace = jasmine.createSpy('myPlace');
		$("#myplace").trigger('click');
		expect(myPlace).toHaveBeenCalled();
		myPlace = oldMethod;
	});

	it('can add a place', function () {
		var oldMethod = clickingplace;
		clickingplace = jasmine.createSpy('clickingplace');
		$("#addplace").trigger('click');
		expect(clickingplace).toHaveBeenCalled();

		expect($("#placebuttons div").length).toEqual(0);

		showPlaceList([
			{
				name: "Dalhousie",
				lat: 12.5,
				lon: -12.5
			}
		]);

		expect($("#placebuttons div").length).toEqual(1);

		clickingplace = oldMethod;
		$("#quitplaces").trigger('click'); // exit my places
	});

	it('can select a place', function () {
		var oldMethod = showPlace;
		showPlace = jasmine.createSpy('showPlace');
		$("#Dalhousie :nth-child(1)").trigger('click');
		expect(showPlace).toHaveBeenCalled();
		showPlace = oldMethod;
	});

	it('can remove a place', function () {
		var oldMethod = removePlace;
		removePlace = jasmine.createSpy('removePlace');
		$("#Dalhousie :nth-child(2)").trigger('click');
		expect(removePlace).toHaveBeenCalled();
		removePlace = oldMethod;
		$("#Dalhousie :nth-child(2)").trigger('click');
		expect($("#placebuttons div").length).toEqual(0);
	});

	it('can close my places', function () {
		var oldMethod = quitPlaces;
		quitPlaces = jasmine.createSpy('quitPlaces');
		$("#quitplaces").trigger('click');
		expect(quitPlaces).toHaveBeenCalled();
		quitPlaces = oldMethod;
		$("#quitplaces").trigger('click');
	});

});
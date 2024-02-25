let j = 1;
for (let i = 1; i <= 6; i++) {
	for (let k = 1; k <= 3; k++) {
		console.log(`insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (${i}, 'Atividade ${j}', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);`);
		j++;
	}
}

/*
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (1, 'Atividade 1', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (1, 'Atividade 2', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (1, 'Atividade 3', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (2, 'Atividade 4', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (2, 'Atividade 5', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (2, 'Atividade 6', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (3, 'Atividade 7', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (3, 'Atividade 8', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (3, 'Atividade 9', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (4, 'Atividade 10', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (4, 'Atividade 11', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (4, 'Atividade 12', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (5, 'Atividade 13', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (5, 'Atividade 14', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (5, 'Atividade 15', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (6, 'Atividade 16', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (6, 'Atividade 17', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);
insert into activities(courseActivityGroupId, name, description, maxWorkload) values
    (6, 'Atividade 18', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus consectetur arcu vel elit vestibulum, nec convallis diam sodales. Nulla dictum laoreet dolor nec pharetra. Nullam tempor viverra laoreet. Ut id tortor non quam bibendum faucibus sit proin.', 30);

*/

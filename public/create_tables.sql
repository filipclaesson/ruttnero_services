drop table raspicam_photos;
create table raspicam_photos (
pic_id SERIAL,
pic_timestamp timestamp,
pic_path text
)


insert into raspicam_photos (pic_timestamp, pic_path) values('2017-01-01'::timestamp, '/var/yay/pic.jpg')
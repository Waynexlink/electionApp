-- Insert sample eligible voters
INSERT INTO eligible_voters (matric_no, name, department) VALUES
('2021/CS/001', 'John Doe', 'Computer Science'),
('2021/CS/002', 'Jane Smith', 'Computer Science'),
('2021/ENG/001', 'Mike Johnson', 'Engineering'),
('2021/ENG/002', 'Sarah Wilson', 'Engineering'),
('2021/BUS/001', 'David Brown', 'Business Administration'),
('2021/BUS/002', 'Lisa Davis', 'Business Administration'),
('2021/MED/001', 'Robert Miller', 'Medicine'),
('2021/MED/002', 'Emily Garcia', 'Medicine'),
('2021/LAW/001', 'James Rodriguez', 'Law'),
('2021/LAW/002', 'Maria Martinez', 'Law');

-- Insert admin user (you'll need to register this user first)
-- This is just a placeholder - the actual admin should be created through the registration process
-- with the email admin@university.edu and then manually updated to admin role

-- Insert sample election
INSERT INTO elections (title, description, start_time, end_time, is_active) VALUES
('Student Union Elections 2024', 'Annual student union elections for academic year 2024-2025', 
 NOW() - INTERVAL '1 day', NOW() + INTERVAL '7 days', true);

-- Get the election ID for reference
DO $$
DECLARE
    election_uuid UUID;
    post_president_uuid UUID;
    post_vp_uuid UUID;
    post_secretary_uuid UUID;
BEGIN
    -- Get the election ID
    SELECT id INTO election_uuid FROM elections WHERE title = 'Student Union Elections 2024';
    
    -- Insert posts (positions)
    INSERT INTO posts (election_id, title, description) VALUES
    (election_uuid, 'President', 'Student Union President - Lead the student body and represent student interests'),
    (election_uuid, 'Vice President', 'Student Union Vice President - Support the president and oversee committees'),
    (election_uuid, 'Secretary', 'Student Union Secretary - Maintain records and coordinate communications');
    
    -- Get post IDs
    SELECT id INTO post_president_uuid FROM posts WHERE title = 'President' AND election_id = election_uuid;
    SELECT id INTO post_vp_uuid FROM posts WHERE title = 'Vice President' AND election_id = election_uuid;
    SELECT id INTO post_secretary_uuid FROM posts WHERE title = 'Secretary' AND election_id = election_uuid;
    
    -- Insert candidates for President
    INSERT INTO candidates (post_id, name, bio, department) VALUES
    (post_president_uuid, 'Alex Thompson', 'Third-year Computer Science student with leadership experience in tech clubs and community service projects.', 'Computer Science'),
    (post_president_uuid, 'Samantha Lee', 'Business Administration student passionate about student welfare and campus improvement initiatives.', 'Business Administration'),
    (post_president_uuid, 'Marcus Johnson', 'Engineering student with experience in student government and project management.', 'Engineering');
    
    -- Insert candidates for Vice President
    INSERT INTO candidates (post_id, name, bio, department) VALUES
    (post_vp_uuid, 'Rachel Green', 'Pre-med student committed to improving campus health and wellness programs.', 'Medicine'),
    (post_vp_uuid, 'Kevin Park', 'Law student with experience in debate and student advocacy.', 'Law'),
    (post_vp_uuid, 'Amanda Foster', 'Computer Science student focused on technology integration and digital student services.', 'Computer Science');
    
    -- Insert candidates for Secretary
    INSERT INTO candidates (post_id, name, bio, department) VALUES
    (post_secretary_uuid, 'Daniel Kim', 'Business student with strong organizational skills and communication experience.', 'Business Administration'),
    (post_secretary_uuid, 'Sophie Chen', 'Engineering student passionate about transparency and efficient record-keeping.', 'Engineering'),
    (post_secretary_uuid, 'Tyler Brooks', 'Liberal Arts student with journalism background and commitment to clear communication.', 'Liberal Arts');
END $$;

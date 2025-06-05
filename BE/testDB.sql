
1. Lấy danh sách khách hàng và thông tin thú cưng của họ:
```sql
SELECT c.full_name, c.phone, c.email, p.name as pet_name, p.species, p.weight
FROM customers c
JOIN pets p ON c.id = p.customer_id;
```

2. Tìm các cuộc hẹn trong ngày hôm nay:
```sql
SELECT a.appointment_time, p.name as pet_name, c.full_name as owner_name
FROM appointments a
JOIN pets p ON a.pet_id = p.id
JOIN customers c ON p.customer_id = c.id
WHERE CAST(a.appointment_date AS DATE) = CAST(GETDATE() AS DATE);
```

3. Tính tổng doanh thu theo tháng:
```sql
SELECT MONTH(date) as month, YEAR(date) as year, SUM(total_amount) as total_revenue
FROM bills
GROUP BY MONTH(date), YEAR(date)
ORDER BY year, month;
```

4. Tìm các phòng đang được sử dụng:
```sql
SELECT r.room_name, p.name as pet_name, pr.time_in, pr.time_out
FROM rooms r
JOIN pet_room pr ON r.id = pr.room_id
JOIN pets p ON pr.pet_id = p.id
WHERE pr.is_available = 0;
```

5. Liệt kê các bác sĩ và số lượng điều trị họ đã thực hiện:
```sql
SELECT m.name as doctor_name, COUNT(t.id) as treatment_count
FROM managers m
JOIN treatments t ON m.id = t.manager_id
GROUP BY m.name;
```

6. Tìm các đơn thuốc có giá trị cao nhất:
```sql
SELECT p.id, p.total_price_prescription, m.medicine_name
FROM prescriptions p
JOIN prescription_medicine pm ON p.id = pm.prescription_id
JOIN medicines m ON pm.medicine_id = m.id
ORDER BY p.total_price_prescription DESC;
```

7. Thống kê số lượng thú cưng theo loài:
```sql
SELECT species, COUNT(*) as count
FROM pets
GROUP BY species;
```

8. Tìm các khách hàng chưa thanh toán hóa đơn:
```sql
SELECT c.full_name, c.phone, b.total_amount, b.date
FROM customers c
JOIN bills b ON c.id = b.customer_id
WHERE b.total_amount > 0;
```

9. Liệt kê các dịch vụ spa phổ biến nhất:
```sql
SELECT s.fees, COUNT(*) as service_count
FROM spa s
GROUP BY s.fees
ORDER BY service_count DESC;
```

10. Tìm các thú cưng cần theo dõi sức khỏe:
```sql
SELECT p.name, p.health, c.full_name as owner_name
FROM pets p
JOIN customers c ON p.customer_id = c.id
WHERE p.health IS NOT NULL;
```

11. Thống kê doanh thu theo loại dịch vụ:
```sql
SELECT 
    CASE 
        WHEN t.id IS NOT NULL THEN 'Treatment'
        WHEN s.id IS NOT NULL THEN 'Spa'
        WHEN r.id IS NOT NULL THEN 'Room'
    END as service_type,
    SUM(b.total_amount) as revenue
FROM bills b
LEFT JOIN treatments t ON b.treatment_id = t.id
LEFT JOIN spa s ON b.spa_id = s.id
LEFT JOIN rooms r ON b.room_id = r.id
GROUP BY 
    CASE 
        WHEN t.id IS NOT NULL THEN 'Treatment'
        WHEN s.id IS NOT NULL THEN 'Spa'
        WHEN r.id IS NOT NULL THEN 'Room'
    END;
```

12. Tìm các cuộc hẹn bị hủy:
```sql
SELECT a.appointment_date, a.appointment_time, p.name as pet_name
FROM appointments a
JOIN pets p ON a.pet_id = p.id
WHERE a.cancelled = 1;
```

13. Liệt kê các thuốc được sử dụng nhiều nhất:
```sql
SELECT m.medicine_name, COUNT(pm.prescription_id) as usage_count
FROM medicines m
JOIN prescription_medicine pm ON m.id = pm.medicine_id
GROUP BY m.medicine_name
ORDER BY usage_count DESC;
```

14. Tìm các khách hàng có nhiều thú cưng nhất:
```sql
SELECT c.full_name, COUNT(p.id) as pet_count
FROM customers c
JOIN pets p ON c.id = p.customer_id
GROUP BY c.full_name
ORDER BY pet_count DESC;
```

15. Thống kê số lượng cuộc hẹn theo ngày trong tuần:
```sql
SELECT DATENAME(WEEKDAY, appointment_date) as day_of_week,
       COUNT(*) as appointment_count
FROM appointments
GROUP BY DATENAME(WEEKDAY, appointment_date);
```

16. Tìm các phòng có doanh thu cao nhất:
```sql
SELECT r.room_name, SUM(b.total_amount) as total_revenue
FROM rooms r
JOIN bills b ON r.id = b.room_id
GROUP BY r.room_name
ORDER BY total_revenue DESC;
```

17. Liệt kê các bác sĩ và chuyên môn của họ:
```sql
SELECT m.name, m.speciality, m.about
FROM managers m
JOIN manager_role mr ON m.id = mr.manager_id
JOIN roles r ON mr.role_id = r.id
WHERE r.role_name = 'ROLE_DOCTOR';
```

18. Tìm các thú cưng cần theo dõi sau điều trị:
```sql
SELECT p.name, t.notes, a.follow_up_date
FROM pets p
JOIN treatments t ON p.id = t.pet_id
JOIN appointments a ON t.appointment_id = a.id
WHERE a.follow_up_date IS NOT NULL;
```

19. Thống kê doanh thu theo giờ trong ngày:
```sql
SELECT DATEPART(HOUR, a.appointment_time) as hour,
       SUM(b.total_amount) as revenue
FROM appointments a
JOIN bills b ON a.id = b.treatment_id
GROUP BY DATEPART(HOUR, a.appointment_time)
ORDER BY hour;
```

20. Tìm các khách hàng chưa có cuộc hẹn nào:
```sql
SELECT c.full_name, c.phone
FROM customers c
LEFT JOIN pets p ON c.id = p.customer_id
LEFT JOIN appointments a ON p.id = a.pet_id
WHERE a.id IS NULL;
```

21. Liệt kê các đơn thuốc theo tháng:
```sql
SELECT MONTH(p.date) as month,
       YEAR(p.date) as year,
       COUNT(*) as prescription_count
FROM prescriptions p
JOIN treatments t ON p.treatment_id = t.id
GROUP BY MONTH(p.date), YEAR(p.date)
ORDER BY year, month;
```

22. Tìm các thú cưng có cân nặng bất thường:
```sql
SELECT p.name, p.weight, p.species
FROM pets p
WHERE p.weight > (
    SELECT AVG(weight) + 2 * STDEV(weight)
    FROM pets
    WHERE species = p.species
);
```

23. Thống kê số lượng cuộc hẹn theo loại dịch vụ:
```sql
SELECT a.service, COUNT(*) as service_count
FROM appointments a
WHERE a.service IS NOT NULL
GROUP BY a.service;
```

24. Tìm các khách hàng có chi tiêu cao nhất:
```sql
SELECT c.full_name, SUM(b.total_amount) as total_spent
FROM customers c
JOIN bills b ON c.id = b.customer_id
GROUP BY c.full_name
ORDER BY total_spent DESC;
```

25. Liệt kê các phòng trống:
```sql
SELECT r.room_name, r.description
FROM rooms r
LEFT JOIN pet_room pr ON r.id = pr.room_id
WHERE pr.id IS NULL OR pr.is_available = 1;
```

26. Tìm các bác sĩ bận rộn nhất:
```sql
SELECT m.name, COUNT(t.id) as treatment_count
FROM managers m
JOIN treatments t ON m.id = t.manager_id
WHERE t.date >= DATEADD(MONTH, -1, GETDATE())
GROUP BY m.name
ORDER BY treatment_count DESC;
```

27. Thống kê doanh thu theo loại thú cưng:
```sql
SELECT p.species, SUM(b.total_amount) as revenue
FROM pets p
JOIN treatments t ON p.id = t.pet_id
JOIN bills b ON t.id = b.treatment_id
GROUP BY p.species;
```

28. Tìm các cuộc hẹn cần nhắc nhở:
```sql
SELECT a.appointment_date, a.appointment_time,
       p.name as pet_name, c.full_name as owner_name
FROM appointments a
JOIN pets p ON a.pet_id = p.id
JOIN customers c ON p.customer_id = c.id
WHERE a.appointment_date = DATEADD(DAY, 1, GETDATE());
```

29. Liệt kê các thuốc hết hạn sử dụng:
```sql
SELECT m.medicine_name, m.type, m.price
FROM medicines m
WHERE m.days < GETDATE();
```

30. Tìm các khách hàng có nhiều cuộc hẹn nhất:
```sql
SELECT c.full_name, COUNT(a.id) as appointment_count
FROM customers c
JOIN pets p ON c.id = p.customer_id
JOIN appointments a ON p.id = a.pet_id
GROUP BY c.full_name
ORDER BY appointment_count DESC;
```

31. Thống kê doanh thu theo quý:
```sql
SELECT 
    DATEPART(QUARTER, date) as quarter,
    YEAR(date) as year,
    SUM(total_amount) as revenue
FROM bills
GROUP BY DATEPART(QUARTER, date), YEAR(date)
ORDER BY year, quarter;
```

32. Tìm các thú cưng cần chăm sóc đặc biệt:
```sql
SELECT p.name, p.health, p.notes
FROM pets p
WHERE p.health LIKE '%special%' OR p.notes LIKE '%special%';
```

33. Liệt kê các dịch vụ spa theo giá:
```sql
SELECT DISTINCT fees, COUNT(*) as service_count
FROM spa
GROUP BY fees
ORDER BY fees;
```

34. Tìm các khách hàng chưa thanh toán đầy đủ:
```sql
SELECT c.full_name, b.total_amount, b.date
FROM customers c
JOIN bills b ON c.id = b.customer_id
WHERE b.total_amount > 0
AND b.date < DATEADD(MONTH, -1, GETDATE());
```

35. Thống kê số lượng điều trị theo loại:
```sql
SELECT t.notes as treatment_type, COUNT(*) as count
FROM treatments t
WHERE t.notes IS NOT NULL
GROUP BY t.notes;
```

36. Tìm các phòng có doanh thu thấp nhất:
```sql
SELECT r.room_name, SUM(b.total_amount) as revenue
FROM rooms r
JOIN bills b ON r.id = b.room_id
GROUP BY r.room_name
ORDER BY revenue ASC;
```

37. Liệt kê các bác sĩ theo chuyên môn:
```sql
SELECT m.name, m.speciality, COUNT(t.id) as treatment_count
FROM managers m
JOIN treatments t ON m.id = t.manager_id
GROUP BY m.name, m.speciality
ORDER BY m.speciality, treatment_count DESC;
```

38. Tìm các thú cưng cần theo dõi sức khỏe định kỳ:
```sql
SELECT p.name, p.health, a.follow_up_date
FROM pets p
JOIN appointments a ON p.id = a.pet_id
WHERE a.follow_up_date IS NOT NULL
AND a.follow_up_date > GETDATE();
```

39. Thống kê doanh thu theo ngày trong tuần:
```sql
SELECT DATENAME(WEEKDAY, date) as day_of_week,
       SUM(total_amount) as revenue
FROM bills
GROUP BY DATENAME(WEEKDAY, date)
ORDER BY revenue DESC;
```

40. Tìm các khách hàng có thú cưng mới:
```sql
SELECT c.full_name, p.name as pet_name, p.species
FROM customers c
JOIN pets p ON c.id = p.customer_id
WHERE p.id IN (
    SELECT MAX(id)
    FROM pets
    GROUP BY customer_id
);
```

41. Liệt kê các đơn thuốc theo bác sĩ:
```sql
SELECT m.name as doctor_name,
       COUNT(p.id) as prescription_count
FROM managers m
JOIN treatments t ON m.id = t.manager_id
JOIN prescriptions p ON t.id = p.treatment_id
GROUP BY m.name;
```

42. Tìm các phòng có nhiều khách nhất:
```sql
SELECT r.room_name, COUNT(pr.pet_id) as pet_count
FROM rooms r
JOIN pet_room pr ON r.id = pr.room_id
GROUP BY r.room_name
ORDER BY pet_count DESC;
```

43. Thống kê số lượng cuộc hẹn theo giờ:
```sql
SELECT DATEPART(HOUR, appointment_time) as hour,
       COUNT(*) as appointment_count
FROM appointments
GROUP BY DATEPART(HOUR, appointment_time)
ORDER BY hour;
```

44. Tìm các khách hàng có nhiều hóa đơn nhất:
```sql
SELECT c.full_name, COUNT(b.id) as bill_count
FROM customers c
JOIN bills b ON c.id = b.customer_id
GROUP BY c.full_name
ORDER BY bill_count DESC;
```

45. Liệt kê các thuốc theo loại:
```sql
SELECT type, COUNT(*) as medicine_count
FROM medicines
GROUP BY type
ORDER BY medicine_count DESC;
```

46. Tìm các thú cưng cần chăm sóc đặc biệt:
```sql
SELECT p.name, p.health, p.notes
FROM pets p
WHERE p.health LIKE '%special%' OR p.notes LIKE '%special%';
```

47. Thống kê doanh thu theo loại thú cưng:
```sql
SELECT p.species, SUM(b.total_amount) as revenue
FROM pets p
JOIN treatments t ON p.id = t.pet_id
JOIN bills b ON t.id = b.treatment_id
GROUP BY p.species
ORDER BY revenue DESC;
```

48. Tìm các cuộc hẹn cần xác nhận:
```sql
SELECT a.appointment_date, a.appointment_time,
       p.name as pet_name, c.full_name as owner_name
FROM appointments a
JOIN pets p ON a.pet_id = p.id
JOIN customers c ON p.customer_id = c.id
WHERE a.appointment_date = DATEADD(DAY, 1, GETDATE())
AND a.is_completed = 0;
```

49. Liệt kê các bác sĩ theo số lượng điều trị:
```sql
SELECT m.name, COUNT(t.id) as treatment_count
FROM managers m
JOIN treatments t ON m.id = t.manager_id
WHERE t.date >= DATEADD(MONTH, -1, GETDATE())
GROUP BY m.name
ORDER BY treatment_count DESC;
```

50. Tìm các khách hàng có chi tiêu cao nhất trong tháng:
```sql
SELECT c.full_name, SUM(b.total_amount) as monthly_spent
FROM customers c
JOIN bills b ON c.id = b.customer_id
WHERE b.date >= DATEADD(MONTH, -1, GETDATE())
GROUP BY c.full_name
ORDER BY monthly_spent DESC;
```




















































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































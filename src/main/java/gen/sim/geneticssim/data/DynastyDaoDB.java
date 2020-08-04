
package gen.sim.geneticssim.data;

import gen.sim.geneticssim.entities.Dynasty;
import gen.sim.geneticssim.entities.Member;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class DynastyDaoDB implements DynastyDao {

    @Autowired
    JdbcTemplate jdbc;
    
    public DynastyDaoDB() {
    }
    
    @Override
    public void addDynasty(Dynasty dynasty) {
        final String sql = "Insert Into dynasty values "
                + "(?, ?, ?, ?, ?, ?, ?, ?, ?)";
        jdbc.update(sql, dynasty.getName(), dynasty.getCrestType(), dynasty.getCrestDesign(), dynasty.getPrimary()[0], dynasty.getPrimary()[1], dynasty.getPrimary()[2], dynasty.getSecondary()[0], dynasty.getSecondary()[1], dynasty.getSecondary()[2]);
    }

    @Override
    public List<Dynasty> getAllDynasties() {
        final String SELECT_DYN = "Select * From dynasty";
        List<Dynasty> dynasties = jdbc.query(SELECT_DYN, new DynastyMapper());
        dynasties = populateSearchDynasties(dynasties);
        return dynasties;
    }

    @Override
    public List<Dynasty> getSearchDynasties(String search) {
        final String SELECT_SEARCH_DYN = "Select * From dynasty Where name Like ?";
        search = "%" + search + "%";
        List<Dynasty> dynasties = jdbc.query(SELECT_SEARCH_DYN, new DynastyMapper(), search);
        dynasties = populateSearchDynasties(dynasties);
        return dynasties;
    }
    
    private List<Dynasty> populateSearchDynasties(List<Dynasty> dynasties) {
        for(int i = 0; i < dynasties.size(); i++) {
            dynasties.set(i, populateDynasty(dynasties.get(i)));
        }
        return dynasties;
    }
    
    private Dynasty populateDynasty(Dynasty dynasty) {
        final String SELECT_FOUNDER = "Select * From `member` Where primaryDynasty = ? && founder = ?";
        final String SELECT_SECONDARY_MEMBERS = "Select * From `member` m "
                + "Left Outer Join memberSecondarydynasties mSd on m.memberId = mSd.memberId "
                + "Where mSd.name = ?";
        final String SELECT_PRIMARY = "Select * From `member` Where primaryDynasty = ?";
        Member founder = jdbc.queryForObject(SELECT_FOUNDER, new MemberMapper(),  dynasty.getName(), true);
        founder.setPrimaryDynasty(getPrimaryDynastyInfo(dynasty.getName()));
        dynasty.setFounder(founder);
        dynasty.setAllMembers(jdbc.query(SELECT_SECONDARY_MEMBERS, new MemberMapper(), dynasty.getName()));
        dynasty.setPrimaryMembers(jdbc.query(SELECT_PRIMARY, new MemberMapper(), dynasty.getName()));
        List<Member> allMembers = dynasty.getAllMembers();
        allMembers.addAll(dynasty.getPrimaryMembers());
        dynasty.setAllMembers(allMembers);
        return dynasty;
    }

    @Override
    public Dynasty getDynastyByName(String dynName) {
        final String sql = "Select * From dynasty Where name = ?";
        Dynasty dynasty = jdbc.queryForObject(sql, new DynastyMapper(), dynName);
        if(dynasty != null) {
            dynasty = populateDynasty(dynasty);
            return dynasty;
        }
        return null;
    }

    @Override
    public Dynasty getPrimaryDynastyInfo(String name) {
        final String sql = "Select * From dynasty Where name = ?";
        Dynasty dynasty = jdbc.queryForObject(sql, new DynastyMapper(), name);
        return dynasty;
    }

    @Override
    public void headlineMemberDynastyInfo(Member member) {
        member.setPrimaryDynasty(getPrimaryDynastyInfo(member.getPrimaryDynasty().getName()));
        final String sql = "Select * From memberSecondarydynasties Where memberId = ? Order By indexOrder ASC";
        List<Dynasty> secDyn = jdbc.query(sql, new SecondaryDynastiesMapper(), member.getMemberId());
        member.setNonprimaryDynasties(secDyn);
    }
    
    public static final class DynastyMapper implements RowMapper<Dynasty> {

        @Override
        public Dynasty mapRow(ResultSet rs, int index) throws SQLException {
            Dynasty dynasty = new Dynasty();
            dynasty.setName(rs.getString("name"));
            dynasty.setCrestType(rs.getInt("crestType"));
            dynasty.setCrestDesign(rs.getInt("crestDesign"));
            int[] primary = new int[3];
            int[] secondary = new int[3];
            primary[0] = rs.getInt("primaryColorRed");
            primary[1] = rs.getInt("primaryColorGreen");
            primary[2] = rs.getInt("primaryColorBlue");
            secondary[0] = rs.getInt("secondaryColorRed");
            secondary[1] = rs.getInt("secondaryColorGreen");
            secondary[2] = rs.getInt("secondaryColorBlue");
            dynasty.setPrimary(primary);
            dynasty.setSecondary(secondary);
            return dynasty;
        }
         
    }
    
    public static final class SecondaryDynastiesMapper implements RowMapper<Dynasty> {

        @Override
        public Dynasty mapRow(ResultSet rs, int index) throws SQLException {
            Dynasty dynasty = new Dynasty();
            dynasty.setName(rs.getString("name"));
            return dynasty;
        }
        
    }
    
    public static final class MemberMapper implements RowMapper<Member> {

        @Override
        public Member mapRow(ResultSet rs, int index) throws SQLException {
            Member member = new Member();
            member.setMemberId(rs.getInt("memberId"));
            member.setName(rs.getString("name"));
            member.setLiving(rs.getBoolean("living"));
            member.setFounder(rs.getBoolean("founder"));
            if(rs.getInt("spouseId") != 0) {
                Member spouse = new Member();
                spouse.setMemberId(rs.getInt("spouseId"));
                member.setSpouse(spouse);
                member.setMatrilineal(rs.getBoolean("matrilineal"));
            }
            return member;
        }
         
    }
}


package gen.sim.geneticssim.data;

import gen.sim.geneticssim.data.TraitDaoDB.TraitMapper;
import gen.sim.geneticssim.entities.Member;
import gen.sim.geneticssim.entities.Trait;
import gen.sim.geneticssim.entities.TraitPackage;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

@Repository
public class TraitDaoDB implements TraitDao {

    @Autowired
    private JdbcTemplate jdbc;
    
    @Override
    public List<Trait> getAllTraits() {
        List<Trait> allTraits;
        final String traitNames = "Select * From trait";
        allTraits = jdbc.query(traitNames, new TraitMapper());
        final String values = "Select * From traitValues Where name = ?";
        for(int i = 0; i < allTraits.size(); i++) {
            List<ValueContainer> vcList = jdbc.query(values, new ValueMapper(), allTraits.get(i).getName());
            List<String> valueList = Arrays.asList(new String[vcList.size()]);
            for(ValueContainer vc : vcList) {
                valueList.set(vc.place, vc.value);
            }
            allTraits.get(i).setValues(valueList);
        }
        return allTraits;
    }

    @Override
    public void retrieveMemberTraits(Member member) {
        final String sql = "Select * From traitpackage Where memberId = ?";
        List<TraitPackage> tpList = jdbc.query(sql, new TraitPackageMapper(), member.getMemberId());
        Map<String, TraitPackage> traits = new HashMap();
        for(TraitPackage tp : tpList) {
            traits.put(tp.getTrait().getName(), tp);
        }
        member.setTraits(traits);
    }
    
    public static final class TraitMapper implements RowMapper<Trait> {

        @Override
        public Trait mapRow(ResultSet rs, int index) throws SQLException {
            Trait trait = new Trait();
            trait.setName(rs.getString("name"));
            return trait;
        }
         
    }
    
    public static final class TraitPackageMapper implements RowMapper<TraitPackage> {

        @Override
        public TraitPackage mapRow(ResultSet rs, int index) throws SQLException {
            Trait trait = new Trait();
            TraitPackage tp = new TraitPackage();
            trait.setName(rs.getString("name"));
            tp.setTrait(trait);
            tp.setValue(rs.getString("value"));
            String[] vp = new String[4];
            vp[0] = rs.getString("vpA");
            vp[1] = rs.getString("vpB");
            vp[2] = rs.getString("vpC");
            vp[3] = rs.getString("vpD");
            tp.setValuePool(vp);
            return tp;
        }
        
    }
     
    public static final class ValueMapper implements RowMapper<ValueContainer> {

        @Override
        public ValueContainer mapRow(ResultSet rs, int index) throws SQLException {
            ValueContainer vc = new ValueContainer(rs.getString("value"), rs.getInt("place"));
            return vc;
        }
         
    }
     
    private static class ValueContainer {
        String value;
        int place;

        public ValueContainer(String value, int place) {
            this.value = value;
            this.place = place;
        }
    }
}

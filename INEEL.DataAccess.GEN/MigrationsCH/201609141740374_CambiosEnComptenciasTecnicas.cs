namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambiosEnComptenciasTecnicas : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.cat_NivelCompetenciaTecnica", "categoriaMin", c => c.Int());
            AlterColumn("CH.cat_NivelCompetenciaTecnica", "categoraMax", c => c.Int());
            AlterColumn("CH.cat_NivelCompetenciaTecnica", "nivelMin", c => c.Int());
            AlterColumn("CH.cat_NivelCompetenciaTecnica", "nivelMax", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("CH.cat_NivelCompetenciaTecnica", "nivelMax", c => c.Int(nullable: false));
            AlterColumn("CH.cat_NivelCompetenciaTecnica", "nivelMin", c => c.Int(nullable: false));
            AlterColumn("CH.cat_NivelCompetenciaTecnica", "categoraMax", c => c.Int(nullable: false));
            AlterColumn("CH.cat_NivelCompetenciaTecnica", "categoriaMin", c => c.Int(nullable: false));
        }
    }
}

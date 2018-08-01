namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModifiqueNivelCompetencia : DbMigration
    {
        public override void Up()
        {
            AlterColumn("CH.cat_NivelesCompetencias", "Descripcion", c => c.String(maxLength: 10));
            DropColumn("CH.cat_NivelesCompetencias", "Periodo");
        }
        
        public override void Down()
        {
            AddColumn("CH.cat_NivelesCompetencias", "Periodo", c => c.String(maxLength: 4));
            AlterColumn("CH.cat_NivelesCompetencias", "Descripcion", c => c.String(maxLength: 200));
        }
    }
}

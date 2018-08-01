namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CampoSexoEnTablaPersonas : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.cat_Personas", "sexo", c => c.String(maxLength: 5));
        }
        
        public override void Down()
        {
            DropColumn("GEN.cat_Personas", "sexo");
        }
    }
}

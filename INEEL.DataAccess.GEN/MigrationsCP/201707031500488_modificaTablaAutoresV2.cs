namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class modificaTablaAutoresV2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CP.tab_Autores", "clave", c => c.String());
            DropColumn("CP.tab_Autores", "idPersona");
        }
        
        public override void Down()
        {
            AddColumn("CP.tab_Autores", "idPersona", c => c.Int(nullable: false));
            DropColumn("CP.tab_Autores", "clave");
        }
    }
}

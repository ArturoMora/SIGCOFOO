namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class configuracionmodulos : DbMigration
    {
        public override void Up()
        {
            //AddColumn("GEN.cat_Modulo", "Url", c => c.String());
            //AddColumn("GEN.cat_Modulo", "UrlImagen", c => c.String());
            //AddColumn("GEN.cat_Modulo", "Secuencia", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            //DropColumn("GEN.cat_Modulo", "Secuencia");
            //DropColumn("GEN.cat_Modulo", "UrlImagen");
            //DropColumn("GEN.cat_Modulo", "Url");
        }
    }
}

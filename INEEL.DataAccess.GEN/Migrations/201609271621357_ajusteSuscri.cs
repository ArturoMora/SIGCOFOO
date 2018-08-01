namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ajusteSuscri : DbMigration
    {
        public override void Up()
        {
            DropPrimaryKey("GEN.OCSuscripciones");
            AlterColumn("GEN.OCSuscripciones", "ClaveEmpleado", c => c.String(nullable: false, maxLength: 10));
            AddPrimaryKey("GEN.OCSuscripciones", new[] { "ClaveEmpleado", "OcsId" });
        }
        
        public override void Down()
        {
            DropPrimaryKey("GEN.OCSuscripciones");
            AlterColumn("GEN.OCSuscripciones", "ClaveEmpleado", c => c.Int(nullable: false));
            AddPrimaryKey("GEN.OCSuscripciones", new[] { "ClaveEmpleado", "OcsId" });
        }
    }
}

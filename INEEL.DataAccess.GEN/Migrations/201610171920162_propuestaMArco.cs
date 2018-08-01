namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class propuestaMArco : DbMigration
    {
        public override void Up()
        {
            //DropPrimaryKey("GEN.Propuestas");
            AlterColumn("GEN.Propuestas", "PropuestaId", c => c.String(nullable: false, maxLength: 25));
            //AddPrimaryKey("GEN.Propuestas", "PropuestaId");
        }
        
        public override void Down()
        {
           // DropPrimaryKey("GEN.Propuestas");
            AlterColumn("GEN.Propuestas", "PropuestaId", c => c.String(nullable: false, maxLength: 10));
            //AddPrimaryKey("GEN.Propuestas", "PropuestaId");
        }
    }
}

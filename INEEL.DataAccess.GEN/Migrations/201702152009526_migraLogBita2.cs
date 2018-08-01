namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraLogBita2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "GEN.tab_LogBitacora",
                c => new
                    {
                        Id = c.Long(nullable: false, identity: true),
                        Date = c.DateTime(nullable: false),
                        Thread = c.String(),
                        Level = c.String(),
                        Logger = c.String(),
                        Action = c.String(),
                        Data = c.String(),
                        User = c.String(),
                        Ip = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("GEN.tab_LogBitacora");
        }
    }
}
